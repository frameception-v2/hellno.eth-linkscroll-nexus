"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function SocialLinks() {
  const { SOCIAL_LINKS } = require("~/lib/constants");

  return (
    <Card className="border-neutral-200 bg-white mb-4">
      <CardHeader>
        <CardTitle className="text-neutral-900">Social Links</CardTitle>
        <CardDescription className="text-neutral-600">
          Connect with hellno.eth
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {SOCIAL_LINKS.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-neutral-800">{link.name}</span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

function ImageCarousel() {
  const { RECENT_IMAGES } = require("~/lib/constants");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % RECENT_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-neutral-200 bg-white mb-4">
      <CardHeader>
        <CardTitle className="text-neutral-900">Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={RECENT_IMAGES[currentImage]}
            alt={`Recent post ${currentImage + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TwitchEmbed() {
  const [showTwitch, setShowTwitch] = useState(false);

  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Twitch Stream</CardTitle>
        <CardDescription className="text-neutral-600">
          {showTwitch ? "Currently live" : "Check if I'm live"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showTwitch ? (
          <div className="relative aspect-video">
            <iframe
              src="https://player.twitch.tv/?channel=hellnotv&parent=frames-v2.vercel.app"
              height="100%"
              width="100%"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        ) : (
          <PurpleButton onClick={() => setShowTwitch(true)}>
            Show Twitch Player
          </PurpleButton>
        )}
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        <SocialLinks />
        <ImageCarousel />
        <TwitchEmbed />
      </div>
    </div>
  );
}

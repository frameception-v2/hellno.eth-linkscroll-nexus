import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAiaGVsbG5vZXRoLWxpbmtzY3JvbGwtbmV4dXMudmVyY2VsLmFwcCJ9",
      signature: "MHhlYjkwZjM5ZGI0YzI5ZWIyYjQyYTQ0MWE1NGY3Njk5YzY4MDk1MGUzOTAxNGQ1Y2RjNWYyOGNkYzkzYTgwZTZkNzM2ZGVmYTM2Yjg1YjQyNzBjZWQzNTQ2ZmExN2U1NGZkMDJkZDFhOWIyNDY3NjE1MTcwMTdiN2ViZDgxNjhkODFj"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}

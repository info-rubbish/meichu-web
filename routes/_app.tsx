import { type PageProps } from "$fresh/server.ts";
import NavBar from "../islands/Navbar.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>meichu2024</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <NavBar />
        <div class="bg-gray-800 w-full">
          <div class="area relative p-4 mx-auto max-w-screen-md">
            <Component />
          </div>
        </div>
      </body>
    </html>
  );
}

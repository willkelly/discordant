import { type PageProps } from 'fresh';

export default function App({ Component }: PageProps) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='Discordant - A modern XMPP chat client with video/audio streaming support'
        />
        <title>Discordant</title>
        <link rel='stylesheet' href='/styles/global.css' />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}

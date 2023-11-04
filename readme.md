# ontopify
https://github.com/danielj247/ontopify/assets/92366070/cb2650ea-2507-4748-893e-0122ad17877f

## Development
When developing/building yourself you will first need to [create an app on the Spotify developer dashboard](https://developer.spotify.com/dashboard/create).

Add `ontopify://callback` as a Redirect URI and add your applications Client ID to `SPOTIFY_CLIENT_ID` in your `env.ts`.

Make sure you copy the contents of `env.example.ts` to a new `env.ts`.

If you want other accounts to use the application then be sure to add users in the User Management tab on the Spotify developer dashboard.

Use the command `npm run start` to start the development server.

## Build

Use the command `npm run make` to build the application to current OS.

## Linting

Run `npm run lint` to lint the project.
Run `npm run lint:fix` to fix linting errors.


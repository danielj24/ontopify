# ontopify
![3f185ba0c24d07c68b111c7e4cbe05eb](https://github.com/danielj247/ontopify/assets/92366070/caa7c416-4b6e-45dc-aafd-577d92d377d3)



## Development
When developing/building yourself you will first need to [create an app on the Spotify developer dashboard](https://developer.spotify.com/dashboard/create).

Make sure you copy the contents of `env.example.ts` to a new `env.ts`.

Add `ontopify://callback` as a Redirect URI and add your applications Client ID to `SPOTIFY_CLIENT_ID` in your `env.ts`.

If you want other accounts to use the application then be sure to add users in the User Management tab on the Spotify developer dashboard (or submit a quota extension request).

Use the command `npm run start` to start the development server.

## Build

Use the command `npm run make` to build the application to current OS.

## Linting

Run `npm run lint` to lint the project.
Run `npm run lint:fix` to fix linting errors.


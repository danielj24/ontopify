# ontopify
![0065e354ab2cd6ef0159a93e44a61056](https://github.com/danielj247/ontopify/assets/92366070/f7281278-3480-4cbb-a6f8-972b7c367f65)


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


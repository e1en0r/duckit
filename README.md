# Duckit

The back-end provided doesn't allow CORS so I created an Express proxy server. The proxy server should be started with `node proxy.js`.
It can be turned on an off in `config/api.ts`.

The instructions say to pass a Bearer token when upvoting and downvoting. Weirdly when this token is passed the back-end returns a 403 error. However with an invalid token the back-end allows upvoting and downvoting. So in `hooks/useDuckVote.ts` I added a `-WTF` string to the end of the token.

I've chosen to display the images cropped because none are square and I think it looks better this way than with gutters all over the place.

A lot of duck images are missing. For any broken images I display a milk carton with a duck on it.

There are some missing unit tests. In a real app I would finish them all. In this demo app that seems like a lot.

The back-end allows for multiple up votes and downvotes per duck per person so the front-end doesn't limit this either.

Don't miss the 404 page.
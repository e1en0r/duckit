The back-end provided doesn't allow CORS, so I created an Express proxy server and have set up the Netlify app to proxy as well.
For local development the proxy server should be started with `npm run proxy`. It can be turned on and off in `config/api.ts`.

The instructions say to pass a Bearer token when upvoting and downvoting. However, when this token is passed, the back-end returns a 403 error. Strangely, when an invalid token is used, the back-end allows upvoting and downvoting. To work around this in I've added a `-WTF` string to the end of the token in `hooks/useDuckVote.ts`. The endpoint to submit a post works correctly.

There is no pagination from the back-end, so it's just one big fetch. This is not my preference for a real-world situation but since this is the case I haven't implemented any pagination.

I've chosen to display the images cropped because none are square, and I think it looks better this way than with gutters all over the place.

A lot of duck images are missing. For any broken images, I display a milk carton with a duck on it.

A few images with URLs like `https://picsum.photos/200/300` render randomly. When you scroll down and scroll back again and see a different image this is not a bug but a side effect of Picsum used in conjunction with a DOM virtualization.

There are some missing unit tests. In a real app, I would finish them all, but in this demo app, that seems like a lot.

The back-end allows for multiple upvotes and downvotes per duck per person, so the front-end doesn't limit this either.

Don't miss the 404 page.

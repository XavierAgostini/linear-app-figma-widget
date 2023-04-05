# Linear App Figma Widget

This Linear & Figma integration is the ultimate solution to streamline your design workflow. With this powerful integration, you can easily create issues directly from your Figma designs and import existing ones. This saves you valuable time and effort, allowing you to focus on what really matters - creating exceptional designs. Plus, collaboration has never been easier. You can seamlessly work with your team to ensure everyone is on the same page and your projects stay organized. Experience the benefits of a truly integrated design experience and take your collaboration to the next level.

Figma Widget Link: https://www.figma.com/community/widget/1225499170325764543

## Features
1. Linear Oauth
2. Import Linear Issues
3. Create Linear Issues
4. Render linear issue as rich text in Figma

## To Run Widget:
1. `yarn`
2. `yarn dev`
3. In Figma: `Import widget from manifest...`

## How to run development server
To use the widget you will need a valid linear API token. You can get this by generating a developer token in the Linear app settings, and then in the Figma console paste in `figma.clientStorage.setAsync('figma-file-id', <LINEAR_API_TOKEN>)`. If you want to use the Oauth flow:

1. Update `.env` Linear credentials against your own linear app
2. `cd server-src`
3. `yarn dev`
4. run ngrok against the local server
5. You will need to add the ngrok ip address to Linear as a callback URL `<NGROCK_URL/oauth/callback>`
6. in `server/main.ts` add your ngrok domain to the `VALID_OAUTH_ORIGINS` array
7. Restart the development server


## Rich Text Rendering
Linear uses [Prosemirror](https://prosemirror.net/) to generate rich text. The widget consumes the prosemirror rich text format and renders it in Figma. There are a few content types that aren't properly supported such as videos and code blocks, due to limitations in Figma. Also when you create tickets, rich text is not saved in linear at the moment.
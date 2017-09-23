const snoowrap = require('snoowrap');

function getLastWord () {
  const reddit = new snoowrap({
    userAgent: process.env.USER_AGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  });
  
  reddit.getComment(process.env.START_COMMENT).expandReplies({
    limit: Infinity,
    depth: Infinity
  }).then(comment => {
    searchCommentReplys(comment);
  });

  const next = (Math.floor(Math.random() * 240 * 60000) + 60000);
  console.log(new Date(new Date().getTime() + next))
  setTimeout(getLastWord, next);
}
getLastWord();


function searchCommentReplys(comment) {
  for (let i = 0; i < comment.replies.length; i++) {
    const reply = comment.replies[i];
    if ([process.env.USERNAME, process.env.TARGET].includes(reply.author.name)) {
      if (reply.replies.length > 0) {
        searchCommentReplys(reply);
      } else if (reply.author.name === process.env.TARGET) {
        replyToComment(reply);
      } else {
        console.log(`${process.env.USERNAME} still has the last comment`);
      }
      break;
    }
  }
}

function replyToComment(comment) {
  console.log(`Reply "${process.env.TEXT}" to "${comment.body}"`);
  // comment.reply(process.env.TEXT);
}
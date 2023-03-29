import pusher from '../../../../lib/pusher'

export default async function handler(
  req,
  res
){
  console.log(req.body)
  //const { socket_id, channel_name, username } = req.body;
  const socketid = req.body.socket_id;
  const channel = req.body.channel_name;
  const user = req.body.username
  //const randomString = Math.random().toString(36).slice(2);

  const presenceData = {
    user_id:user,
    user_info: {
      username: "@" + user,
    },
  };



  try {
    const auth = pusher.authorizeChannel(socketid, channel, presenceData)
    res.send(auth);
  } catch (error) {
    console.error(error);
    res.send(500)
  }
}

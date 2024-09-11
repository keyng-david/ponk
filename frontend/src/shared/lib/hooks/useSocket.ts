// import useWebSocket from "react-use-websocket";

export const useSocket = () => { 
    // 
}

// export const useSocket = () => {
//     const { sendMessage, lastMessage } = useWebSocket(
//         'wss://socket.toptubereviews.buzz',
//         {
//             shouldReconnect: () => true,
//             reconnectInterval: 0,
//             onOpen: () => {
//                 const token = localStorage.getItem('jwt-token')
//                 sendMessage(`handshake:{"jwt_token":"${token}"}`)
//             },
//         }
//     )

//     return {
//         lastMessage,

//         sendMessage,
//     }
// }
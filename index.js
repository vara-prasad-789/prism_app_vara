// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const axios = require('axios');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/", (req, res) => {
//   const requestData = req.body
//   console.log(requestData)
//   switch (requestData.eventType) {
//     case "message":
//       console.log(requestData)
//       // const messageData = {
//       //   data: {
//       //     client_name: requestData.senderName,
//       //     client_number: requestData.waId
//       //   }
//       // id: requestData.id,
//       // whatsapp_message_id: requestData.whatsappMessageId,
//       // conversation_id: requestData.conversationId,
//       // ticket_id: requestData.ticketId,
//       // message_text: requestData.text,
//       // type: requestData.type,
//       // data: requestData.data,
//       // source_id:requestData.sourceId,
//       // source_url: requestData.sourceUrl,
//       // timestamp: requestData.timestamp,
//       // owner: requestData.owner,
//       // event_type: requestData.eventType,
//       // status_string: requestData.statusString,
//       // avatar_url: requestData.avatarUrl,
//       // assignee_id: requestData.assigneeId,
//       // operator_name: requestData.operatorName,
//       // operator_email: requestData.operatorEmail,
//       // wa_id: requestData.waId,
//       // message_contact: requestData.messageContact,
//       // sender_name: requestData.senderName,
//       // list_reply: requestData.listReply,
//       // reply_context_id: requestData.replyContextId,
//       // created_at: requestData.created,
//       // }
//       // console.log(messageData)
//       // res.json(messageData)
//       // let data = JSON.stringify(messageData);
//       const panNumber = requestData.text
//       // console.log(panNumber, "------------------------------")
//       const axios = require('axios');
//       // let data = JSON.stringify({
//       //   "data": {
//       //     "answer": `${panNumber}`
//       //   }
//       // });

//       // axios.put('http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/listenmodes/4', data, {
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     'Authorization': 'Bearer ce190cf6f77ddd2b3b0d83215b4f31e770f39c5df700b3064bf7d6168cc725cfd6d0636091083850a59cac77bb2aa75162179e896b48782c27d8c631d3149e8fa0ff255bc251434eccc6c89f542363a95c9daca26ca8a967dc839020a0390bcdcef510c361b6be06010181d3a2e8307aab120faadfa30be3e56947bdc99e3ccc'
//       //   }
//       // })
//       //   .then(response => {
//       //     // console.log("data inserted", JSON.stringify(response.data));
//       //   })
//       //   .catch(error => {
//       //     console.log("error", error);
//       //   });
//       break;

//     case "newContactMessageReceived":
//       console.log(requestData)
//       const newMessageData = {
//         event_type: requestData.eventType,
//         contact_id: requestData.id,
//         created: requestData.created,
//         contact_wa_id: requestData.waId,
//         sender_name: requestData.senderName,
//         source_id: requestData.sourceId,
//         source_url: requestData.sourceUrl,
//       }
//       console.log(newMessageData)
//       console.log("newContactMessageReceived")
//       res.json("newContactMessageReceived", newMessageData)
//       break;

//     case "sessionMessageSent":
//       console.log("session msg sent ====================================")
//       // console.log(requestData)
//       const sessionMessageSentData = {
//         event_type: requestData.eventType,
//         message_id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         text: requestData.text,
//         type: requestData.type,
//         data: requestData.data,
//         timestamp: requestData.timestamp,
//         owner: requestData.owner,
//         status_string: requestData.statusString,
//         assignee_id: requestData.assigneeId,
//         operator_email: requestData.operatorEmail,
//         operator_name: requestData.operatorName,
//         wa_id: requestData.waId,
//       }
//       res.json(sessionMessageSentData)
//       console.log("sessionMessageSent")
//       console.log(sessionMessageSentData)
//       // const sentMessageSentData = {
//       //   "data": {
//       //     "whatsappNumber": `${requestData.waId}`,
//       //     "question": `${requestData.text}`,
//       //     "answer": "",
//       //     "response": ""
//       //   }
//       // }

//       // if (requestData.text.includes("Please enter the PAN")) {
//       //   axios.post('http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/listenmodes', sentMessageSentData, {
//       //     headers: {
//       //       'Content-Type': 'application/json',
//       //       'Authorization': 'Bearer ce190cf6f77ddd2b3b0d83215b4f31e770f39c5df700b3064bf7d6168cc725cfd6d0636091083850a59cac77bb2aa75162179e896b48782c27d8c631d3149e8fa0ff255bc251434eccc6c89f542363a95c9daca26ca8a967dc839020a0390bcdcef510c361b6be06010181d3a2e8307aab120faadfa30be3e56947bdc99e3ccc'
//       //     }
//       //   })
//       //     .then(response => {
//       //       console.log("Waiting for the PAN details!!!");
//       //     })
//       //     .catch(error => {
//       //       console.log("error", error);
//       //     });
//       // }
//       // break;

//     case "templateMessageSent":
//       console.log(requestData)
//       const templateMessageSentData = {
//         event_type: requestData.eventType,
//         link_id: requestData.id,
//         link_whatsapp_message_id: requestData.whatsappMessageId,
//         template_id: requestData.templateId,
//         template_name: requestData.templateName,
//         created: requestData.created,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         link_username_operator_email: requestData.operatorEmail,
//         wa_id: requestData.waId,
//         type: requestData.type,
//         status_string: requestData.statusString,
//         source_type: requestData.sourceType,
//       }
//       console.log(templateMessageSentData)
//       res.json(templateMessageSentData)
//       break;

//     case "sentMessageDELIVERED":
//       console.log("sentMessageDELIVERED")
//       console.log(requestData)
//       const sentMessageDELIVEREDData = {
//         event_type: requestData.eventType,
//         status_string: requestData.statusString,
//         message_id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         type: requestData.type,
//         timestamp: requestData.timestamp,
//         assignee_id: requestData.assigneeId,
//         operator_email: requestData.operatorEmail,
//       }
//       console.log(sentMessageDELIVEREDData)
//       res.json(sentMessageDELIVEREDData)
//       break;

//     case "sentMessageREAD":
//       console.log("sentMessageREAD")
//       console.log(requestData)
//       // const sentMessageREADData = {
//       //   event_type: requestData.eventType,
//       //   status_string: requestData.statusString,
//       //   message_id: requestData.id,
//       //   whatsapp_message_id: requestData.whatsappMessageId,
//       //   conversation_id: requestData.conversationId,
//       //   ticket_id: requestData.ticketId,
//       //   text: requestData.text,
//       //   type: requestData.type,
//       //   timestamp: requestData.timestamp,
//       //   assignee_id: requestData.assigneeId,
//       //   operator_email: requestData.operatorEmail,
//       // }
//       res.json(sentMessageREADData)
//       break;

//     case "sentMessageREPLIED":
//       console.log("sentMessageREPLIED")
//       console.log(requestData)
//       const sentMessageREPLIEDData = {
//         event_type: requestData.eventType,
//         status_string: requestData.statusString,
//         id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         type: requestData.type,
//         timestamp: requestData.timestamp,
//         assignee_id: requestData.assigneeId,
//         operator_email: requestData.operatorEmail,
//       }
//       console.log(sentMessageREPLIEDData)
//       res.json(sentMessageREPLIEDData)
//       break;

//     case "templateMessageSent_v2":
//       console.log("templateMessageSent_v2")
//       console.log(requestData)
//       const templateMessageSent_v2Data = {
//         event_type: requestData.eventType,
//         local_message_id: requestData.localMessageId,
//         id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         template_id: requestData.templateId,
//         template_name: requestData.templateName,
//         created: requestData.created,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         operator_email: requestData.operatorEmail,
//         wa_id: requestData.waId,
//         type: requestData.type,
//         status_string: requestData.statusString,
//         source_type: requestData.sourceType,
//       }
//       console.log(templateMessageSent_v2Data)
//       res.json(templateMessageSent_v2Data)
//       break;

//     case "sentMessageREAD_v2":
//       console.log("sentMessageREAD_v2")
//       console.log(requestData)
//       const sentMessageREAD_v2Data = {
//         event_type: requestData.eventType,
//         status_string: requestData.statusString,
//         local_message_id: requestData.localMessageId,
//         id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         type: requestData.type,
//         timestamp: requestData.timestamp,
//         assignee_id: requestData.assigneeId,
//         operator_email: requestData.operatorEmail,
//       }
//       console.log(sentMessageREAD_v2Data)
//       res.json(sentMessageREAD_v2Data)
//       break;

//     case "sentMessageDELIVERED_v2":
//       console.log("sentMessageDELIVERED_v2")
//       console.log(requestData)
//       const sentMessageDELIVERED_v2Data = {
//         event_type: requestData.eventType,
//         status_string: requestData.statusString,
//         local_message_id: requestData.localMessageId,
//         id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         type: requestData.type,
//         timestamp: requestData.timestamp,
//         assignee_id: requestData.assigneeId,
//         operator_email: requestData.operatorEmail,
//       }
//       console.log(sentMessageDELIVERED_v2Data)
//       res.json(sentMessageDELIVERED_v2Data)
//       break;

//     case "sentMessageREPLIED_v2":
//       console.log("sentMessageREPLIED_v2")
//       console.log(requestData)
//       const sentMessageREPLIED_v2Data = {
//         event_type: requestData.eventType,
//         status_string: requestData.statusString,
//         local_message_id: requestData.localMessageId,
//         id: requestData.id,
//         whatsapp_message_id: requestData.whatsappMessageId,
//         conversation_id: requestData.conversationId,
//         ticket_id: requestData.ticketId,
//         text: requestData.text,
//         type: requestData.type,
//         timestamp: requestData.timestamp,
//         assignee_id: requestData.assigneeId,
//         operator_email: requestData.operatorEmail,
//       }
//       console.log(sentMessageREPLIED_v2Data)
//       res.json(sentMessageREPLIED_v2Data)
//       break;
//   }
// })

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
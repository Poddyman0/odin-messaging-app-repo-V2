#! /usr/bin/env node

console.log(
    'This script populates some test events and profiles into the database.'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Message = require("./models/messagesModel");
  const Profile = require("./models/profileModel");
  const Conversation = require("./models/conversationModel");
  
  const messages = [];
  const profiles = [];
  const conversations = []
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createProfiles();
    await createConversation()
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  

  async function profileCreate(index, username, email, password, profileSignedIn, friends) {
    const profile = new Profile({ 
        username: username, 
        email: email,
        password: password,
        profileSignedIn: profileSignedIn,
        friends: friends

    });
    await profile.save();
    profiles[index] = profile;
    console.log(`Added profile with email: ${email}`);
  }

  //here
  async function conversationCreate(index, isGroup, participants, conversationName) {
    const conversation = new Conversation ({ 
        isGroup: isGroup,
        participants: participants,
        conversationName: conversationName
    })

    await conversation.save();
    conversations[index] = conversation;
    console.log(`Added conversation with name: ${conversationName}`);
  }
  
  async function messageCreate(index, messageBody, timestamp, image, messageSentByProfile, conversationID) {
    const message = new Message ({ 
        messageBody: messageBody,
        timestamp: timestamp,
        image: image,
        messageSentByProfile: messageSentByProfile,
        conversationID: conversationID
    })

    await message.save();
    messages[index] = message;
    console.log(`Added message with message sent by profile: ${messageSentByProfile}`);
  }


  //check if dates are right
  async function createProfiles() {
    console.log("Adding profiles");
    await Promise.all([
      profileCreate(0, "example name 1", "exampleemail1@domain.com", "password1", false, []),
      profileCreate(1, "example name 2", "exampleemail2@domain.com", "password2", false, []),
      profileCreate(2, "example name 3", "exampleemail3@domain.com", "password3", false, []),
      profileCreate(3, "example name 4", "exampleemail4@domain.com", "password4", false, []),
      profileCreate(4, "example name 5", "exampleemail5@domain.com", "password5", false, []),
      profileCreate(5, "example name 6", "exampleemail6@domain.com", "password6", false, []),
      profileCreate(6, "example name 7", "exampleemail7@domain.com", "password7", false, []),
      profileCreate(7, "example name 8", "exampleemail8@domain.com", "password8", false, []),
    ]);
  }

  async function createConversation() {
    console.log("Adding conversations");
    await Promise.all([
        conversationCreate(0, false, [profiles[0], profiles[1]], "conversation 1"),
        conversationCreate(1, false, [profiles[2], profiles[3]], "conversation 2"), 
        conversationCreate(2, true, [profiles[4], profiles[5], profiles[6], profiles[7]], "conversation 3")
    ]);
  }
  
  async function createMessages() {
    console.log("Adding messages");
    await Promise.all([
        messageCreate(0, "example message text 1", "Tue May 06 2026 14:23:45 GMT+0100 (British Summer Time)", "https://moderncat.com/wp-content/uploads/2017/12/What-Do-Cats-Think_ss_1284290062_Lalandrew-1440x980.jpg", profiles[0], conversations[0]),
        messageCreate(1, "example message text 2", "Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time)", "https://cdn.shopify.com/s/files/1/1897/4203/files/Editorial_8_July_2024_Image_2.jpg?v=1720495181", profiles[1], conversations[0]),
        messageCreate(2, "example message text 3", "Fri Nov 15 2025 09:12:30 GMT+0000 (Greenwich Mean Time)", "https://supertails.com/cdn/shop/articles/360_f_681163919_71bp2aiyziip3l4j5mbphdxtipdtm2zh_e2c1dbbd-e3b0-4c7d-bc09-1ebff39513ef_1200x.jpg?v=1747293323", profiles[2], conversations[1]),
        messageCreate(3, "example message text 4", "Wed Aug 20 2025 18:47:10 GMT+0100 (British Summer Time)", "https://www.swelluk.com/media/wordpress/b1136ecec2d2c358d0610288c88edbaa.png", profiles[3], conversations[1]),
        //
        messageCreate(4, "example message text 5", "Tue May 06 2026 14:23:45 GMT+0100 (British Summer Time)", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pig_farm_Vampula_1.jpg/250px-Pig_farm_Vampula_1.jpg", profiles[4], conversations[2]),
        messageCreate(5, "example message text 6", "Mon Jan 01 2024 00:00:00 GMT+0000 (Greenwich Mean Time)", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Male_and_female_chicken_sitting_together.jpg/250px-Male_and_female_chicken_sitting_together.jpg", profiles[5], conversations[2]),
        messageCreate(6, "example message text 7", "Fri Nov 15 2025 09:12:30 GMT+0000 (Greenwich Mean Time)", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hausziege_04.jpg/960px-Hausziege_04.jpg", profiles[6], conversations[2]),
        messageCreate(7, "example message text 0", "Wed Aug 20 2025 18:47:10 GMT+0100 (British Summer Time)", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg/330px-Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg", profiles[7], conversations[2]),
    ]);
  }

 
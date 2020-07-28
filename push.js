let webPush = require('web-push');

const vapidKeys = {
  "publicKey": "BI0j2mMawOoMyf6kRm4b-6Kr1PzHJrPKrqqjwFGqWoK8s_9W6vCVHAST_efS4oJojplZ1mL7WtAqm9qwknf_Nnk",
  "privateKey": "y3GFTUWloYdVLmIK8FYbutWAHJM18Kmc2Wy32bQICYQ"
};

webPush.setVapidDetails(
  'mailto:inifadlan7@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

let pushSubscription = {
  "endpoint": "https://fcm.googleapis.com/fcm/send/czHwt8v81Ek:APA91bGBnuBwyNKKUo1YN1BiS5KQMvAE_HKtnRiAKvJvnclnewZWgZXwTK99gDQHroB2uQaSYgTFlK3HiVtqick6QbdIp5VRZAdD6s2HLMqNVijfXhcGTImCBsi02jbyiGHkOO4FILGL",
  "keys": {
    "p256dh": "BJWsW4IyLJdxJ3UKjPYb4HesAWjkFhi1kW2DRtQpAH8MjDvfVSXaYL19raNlQ7LWkYQDIIfyg6uNC/iJrDqJAwI=",
    "auth": "6yb9fQrRqc1sDjOHBaaflQ=="
  }
};

let payload = 'Halloo... Ini push notification dari Premier League';

let options = {
  gcmAPIKey: '475356285341',
  TTL: 60
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
)
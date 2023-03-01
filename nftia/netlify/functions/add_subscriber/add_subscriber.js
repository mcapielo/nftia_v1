const base64 = require('base-64');

exports.handler = async (event) => {
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const errorGen = msg => {
    return { statusCode: 500, body: msg };
  };

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return errorGen('Missing Email');
    }

    const subscriber = {
      email_address: email,
      status: 'subscribed',
    };
    
    const dc = "us13"

    const token = process.env.MAILCHIMP_KEY
    const creds = 'any:'+token+'-us13';
    const response = await fetch(
      'https://us13.api.mailchimp.com/3.0/lists/89fd13d64d/members/',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64.encode(creds)}`,
        },
        body: JSON.stringify(subscriber),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: data.status, body: data.detail };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "You've signed up to the mailing list!",
        detail: data,
      }),
    };
  } catch (err) {
    console.log(err); 
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
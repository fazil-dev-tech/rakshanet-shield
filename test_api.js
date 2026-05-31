const fetch = require('node-fetch'); // or native fetch if Node 18+

async function testApi() {
  try {
    const response = await fetch('https://cyberbriefing.info/api/v1/search', {
      method: 'POST',
      headers: {
        'X-API-Key': 'tp_0498f28fcf403cacfb2e7139f62ceaa5e25a7cfa853dd2c1d9e6448c',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: 'ransomware', limit: 2 })
    });
    
    if (!response.ok) {
      console.log('HTTP Error:', response.status);
      console.log(await response.text());
      return;
    }
    
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testApi();

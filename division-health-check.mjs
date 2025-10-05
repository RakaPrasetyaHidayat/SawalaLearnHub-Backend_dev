const urls = [
  'https://learnhubbackenddev.vercel.app/api/users/division/frontend?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/backend?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/ui/ux?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/ui-ux?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/uiux?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/UI/UX?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/UI-UX?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/division/UI_UX?year=2025',
  'https://learnhubbackenddev.vercel.app/api/users/all',
  'https://learnhubbackenddev.vercel.app/api/users/division/devops?year=2025',
];

async function probe(url) {
  try {
    console.log('\n---');
    console.log('URL:', url);
    const res = await fetch(url, { method: 'GET' });
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    try {
      const json = text ? JSON.parse(text) : null;
      console.log('Response type: JSON');
      if (Array.isArray(json?.data)) {
        console.log('data array length:', json.data.length);
        console.log('sample:', JSON.stringify(json.data.slice(0, 3), null, 2));
      } else if (Array.isArray(json)) {
        console.log('root is array length:', json.length);
        console.log('sample:', JSON.stringify(json.slice(0, 3), null, 2));
      } else {
        console.log('body:', JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.log('Non-JSON response (text):', text.slice(0, 800));
    }
  } catch (err) {
    console.error('Fetch error:', err?.message || err);
  }
}

(async () => {
  for (const u of urls) {
    await probe(u);
  }
})();

// Quick test to verify forum API is working
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-production-6148.up.railway.app';

async function testForumAPI() {
  console.log('Testing API URL:', API_URL);

  try {
    const response = await fetch(`${API_URL}/forum/categories`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      return;
    }

    const data = await response.json();
    console.log('Success! Received', data.length, 'categories');
    console.log('First category:', data[0]);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testForumAPI();

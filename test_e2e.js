async function test() {
  const base = 'http://localhost:3000';
  
  // 1. Test HTML
  const html = await fetch(base + '/').then(r => r.text());
  console.log('HTML has nav-user-wrap:', html.includes('id="nav-user-wrap"'));
  console.log('HTML has modal-auth:', html.includes('id="modal-auth"'));
  console.log('HTML has clean logo rect rx 16:', html.includes('rx="16"'));

  // 2. Test Register
  const testUser = 'user_' + Date.now();
  const regRes = await fetch(base + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUser, password: 'password123', name: 'Akira' })
  });
  const regData = await regRes.json();
  console.log('Register status:', regRes.status, 'Token exists:', !!regData.token, 'Username:', regData.user?.username);

  // 3. Test Auth Me
  const meRes = await fetch(base + '/api/auth/me', {
    headers: { 'Authorization': 'Bearer ' + regData.token }
  });
  const meData = await meRes.json();
  console.log('Auth me authenticated:', meData.authenticated, 'User name:', meData.user?.name);

  // 4. Test Clean Slate for new user
  const mistakesRes = await fetch(base + '/api/mistakes', {
    headers: { 'Authorization': 'Bearer ' + regData.token }
  });
  const mistakes = await mistakesRes.json();
  console.log('New user mistakes count:', mistakes.length);

  const profileRes = await fetch(base + '/api/profile', {
    headers: { 'Authorization': 'Bearer ' + regData.token }
  });
  const profile = await profileRes.json();
  console.log('New user profile totalMistakes:', profile.totalMistakes, 'totalSessions:', profile.totalSessions);

  // 5. Test Start Session & Turn 0 Call (Phone pickup)
  const sesId = 'ses_test_' + Date.now();
  await fetch(base + '/api/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + regData.token },
    body: JSON.stringify({ id: sesId, topic: 'Ramen & Izakaya', level: 'Beginner', language: 'Japanese' })
  });

  console.log('Testing AI opening greeting (Turn 0)...');
  const chatRes = await fetch(base + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + regData.token },
    body: JSON.stringify({
      system: 'You are Kenji, live audio phone call. Learner Level: Beginner. Topic: Ramen. CALL INITIATION / TURN 0 (PHONE JUST CONNECTED): User has NOT spoken yet. Pick up phone as Kenji, greet caller, set context, ask open question. STRICT: DO NOT roast, DO NOT mock, fix MUST be empty string.',
      messages: [],
      sessionId: sesId,
      userText: '',
      language: 'Japanese'
    })
  });
  const chatData = await chatRes.json();
  console.log('Opening AI tutor response:');
  console.log('zh:', chatData.zh);
  console.log('en:', chatData.en);
  console.log('fix (MUST BE EMPTY):', JSON.stringify(chatData.fix));
  
  // Verify mistakes bank is STILL 0 after turn 0
  const afterMistakes = await fetch(base + '/api/mistakes', {
    headers: { 'Authorization': 'Bearer ' + regData.token }
  }).then(r => r.json());
  console.log('Mistakes after opening greeting (MUST BE 0):', afterMistakes.length);
}
test().catch(console.error);

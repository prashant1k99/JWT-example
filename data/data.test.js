const {
  posts,
  users,
  refreshTokens
} = require('./index')

test('Testing Post data', () => {
  expect(Array.isArray(posts)).toBeTruthy();
  expect(posts.length).toBe(3);
  expect(typeof posts[0]).toBe('object');
  expect(posts[0].id).toBeTruthy()
  posts.push({
    id: '4',
    title: 'some random title',
    user: 'test user'
  })
  expect(posts.length).toBe(4)
})

test('Testing User data', () => {
  expect(typeof users).toBe('object');
  users.set('psc', 'test');
  expect(users.has('psc')).toBeTruthy();
  expect(users.get('psc')).toBe('test');
  expect(users.delete('psc')).toBeTruthy();
  expect(users.has('psc')).not.toBeTruthy();
})

test('Testing Refresh token', () => {
  expect(Array.isArray(refreshTokens)).toBeTruthy();
  expect(refreshTokens.length).toBe(0)
})
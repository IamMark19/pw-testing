import { test, expect } from '@playwright/test';

const baseUrl = 'https://conduit-api.bondaracademy.com/api';
let token: string; // Declare token variable in a scope accessible to all tests
test.beforeAll('run beforea all tests', async ({ request }) => {
  // 1. Login
  const loginData = {
    user: {
      email: 'pwtesting20261@gmail.com',
      password: 'pwtesting20261'
    }
  };
  const responseLogin = await request.post(`${baseUrl}/users/login`, {
    data: loginData
  });

  await expect(responseLogin).toBeOK();
  const responseLoginBody = await responseLogin.json();
  token = responseLoginBody.user.token;
}); 


test('get All Articles', async ({ request }) => {
  const response = await request.get(`${baseUrl}/articles?limit=10&offset=0`);
  await expect(response).toBeOK();
  expect(await response.status()).toEqual(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('articles');
  expect(responseBody.articles).toBeInstanceOf(Array);
   console.log(responseBody);
});


test('create new article', async ({ request }) => {
  const articleTitle = 'New Article mark it down 1';

  
  const headers = { 'Authorization': `Token ${token}` };

  // 2. Create Article
  const newArticle = {
    article: {
      title: articleTitle,
      description: 'This is a new article',
      body: 'This is the body of the new article',
      tagList: ['test', 'article']
    }
  };

  const response = await request.post(`${baseUrl}/articles`, {
    data: newArticle,
    headers
  });

  expect(response.status()).toEqual(201); // Fixed: response.status() is synchronous in Playwright
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('article');
  expect(responseBody.article).toHaveProperty('title', articleTitle);
  
  // Extract the unique slug from the creation response payload
  const articleSlug = responseBody.article.slug;

  // 3. Verify Creation (Directly fetching via its unique slug)
  const responseArticle = await request.get(`${baseUrl}/articles/${articleSlug}`, {
    headers
  });
  await expect(responseArticle).toBeOK();
  
  const responseArticleBody = await responseArticle.json();
  expect(responseArticleBody.article).toHaveProperty('title', articleTitle);
});

test('delete article', async ({ request }) => {
  
 
  const headers = { 'Authorization': `Token ${token}` };

  // 2. Create the article first so we definitely have something to delete
  const createResponse = await request.post(`${baseUrl}/articles`, {
    headers,
    data: {
      article: {
        title: 'Article to Delete test12345678',
        description: 'Temporary article',
        body: 'This will be deleted shortly',
        tagList: ['test']
      }
    }
  });
  expect(createResponse.status()).toEqual(201);
  const createResponseBody = await createResponse.json();
  const articleSlug = createResponseBody.article.slug;

  // 3. Delete the article using its specific slug
  const deleteResponse = await request.delete(`${baseUrl}/articles/${articleSlug}`, { headers });
  expect(deleteResponse.status()).toEqual(204);

  // 4. Verify Deletion (Expecting a 404 Not Found)
  const responseAfterDelete = await request.get(`${baseUrl}/articles/${articleSlug}`, { headers });
  expect(responseAfterDelete.status()).toEqual(404);
});

test('update and delete article', async ({ request }) => {
  
  const headers = { 'Authorization': `Token ${token}` };

  // 2. Create Article
  const createRes = await request.post(`${baseUrl}/articles`, {
    headers,
    data: { article: { title: 'createfinal 3', description: 'New', body: 'Body', tagList: ['test'] } }
  });
  expect(createRes.status()).toEqual(201);
  const { article: createdArticle } = await createRes.json();

  // 3. Update Article (Using slug directly from creation response)
  const updateRes = await request.put(`${baseUrl}/articles/${createdArticle.slug}`, {
    headers,
    data: { article: { title: 'update 3', description: 'Updated', body: 'Updated body', tagList: ['updated'] } }
  });
  expect(updateRes.status()).toEqual(200);
  const { article: updatedArticle } = await updateRes.json();
  expect(updatedArticle.title).toEqual('update 3');

  // 4. Delete Article (Using slug directly from update response)
  const deleteRes = await request.delete(`${baseUrl}/articles/${updatedArticle.slug}`, { headers });
  expect(deleteRes.status()).toEqual(204);

  // 5. Verify Deletion
  const verifyRes = await request.get(`${baseUrl}/articles/${updatedArticle.slug}`, { headers });
  expect(verifyRes.status()).toEqual(404); // Conduit returns 404 if a specific slug is deleted
});



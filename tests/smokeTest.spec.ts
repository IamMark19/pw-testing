import { test } from '../utils/fixtures';

test('first test', async ({ api }) => {
    
    api
        // .url('https://random.com/api')
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: 'authToken'})
        .body({user: {
                email: 'pwtesting20261@gmail.com',
                password: 'pwtesting20261'
        }
        })
        .getUrl()
    
}); 
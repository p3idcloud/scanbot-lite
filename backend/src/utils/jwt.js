'use strict';
const users = require('../services/user');

module.exports.generateTokens = async (provider) => {

  if (provider === 'google') {
    return {
      authorizationToken: '8252ef79-9281-4e60-afe4-7eea71f27744',
      refreshToken: '8252ef79-9281-4e60-afe4-7eea71f27744'
    };
  } else if (provider === 'facebook') {
    return {
      authorizationToken: '1af633dc-0328-45c5-8f87-03b457a3899f',
      refreshToken: '1af633dc-0328-45c5-8f87-03b457a3899f'
    };
  }

  let query = [];
  query.push({email:provider});
  let orQuery = {'$or':query};
  const foundUser = await users.getUsersFromQuery(orQuery,1,1,'createdAt');
  if (foundUser.count>0) {
      return {
        authorizationToken: foundUser.retValue[0].id,
        refreshToken: foundUser.retValue[0].id
      };
  }

  // just default back to first user again if we can't find
  return {
    authorizationToken: '8252ef79-9281-4e60-afe4-7eea71f27744',
    refreshToken: '8252ef79-9281-4e60-afe4-7eea71f27744'
  };
};
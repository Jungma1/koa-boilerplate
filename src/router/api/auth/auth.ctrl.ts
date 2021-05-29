import { Context } from 'koa';
import Joi from 'joi';
import User from '../../../models/user';

/*
  POST /api/auth/register
  {
    "username": "Jungma",
    "email": "test@naver.com",
    "password": 1234
  }
*/
export const register = async (ctx: Context) => {
  // Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  // 유저 데이터 처리
  const { username, email, password } = ctx.request.body;

  try {
    const exists = await User.findByEmail(email);

    if (exists) {
      // email이 이미 존재 하는지 확인
      ctx.status = 409; // Conflict
      return;
    }

    const user = new User({
      username,
      email,
    });

    await user.setPassword(password);
    await user.save();

    // response 테스트
    const data = user.toJSON();
    delete data.password;
    ctx.body = data;

    // 토큰 발행
    const token = user.generateToken();

    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500);
  }
};

/*
  POST /api/auth/login
  {
    "email": "test@naver.com",
    "password": "1234"
  }
*/
export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await User.findByEmail(email); // 해당하는 이메일이 있는지 확인

    if (!user) {
      ctx.status = 401; // Unauthorized
      return;
    }

    const vaild = await user.checkPassword(password); // 비밀번호가 맞는지 확인

    if (!vaild) {
      ctx.status = 401; // Unauthorized
      return;
    }

    // response 테스트
    const data = user.toJSON();
    delete data.password;
    ctx.body = data;

    // 토큰 발행
    const token = user.generateToken();

    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/auth/logout
*/
export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token');
  ctx.status = 204; // No Content
};

/*
  GET /api/auth/check
*/
export const check = async (ctx: Context) => {
  const { user } = ctx.state;

  if (!user) {
    ctx.status = 401; // Unauthorized
    return;
  }

  ctx.body = user;
};

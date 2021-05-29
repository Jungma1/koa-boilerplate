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
  } catch (e) {
    ctx.throw(500);
  }
};

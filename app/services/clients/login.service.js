const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();



const login = async (email, password) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user)
      return {
        code: 400,
        data: { success: false, errors: [{ msg: `User doesn't exist` }] }
      }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return {
        code: 400,
        data: { success: false, errors: [{ msg: "Email or Password incorrect" }] }
      }

    if (user.suspended) 
        return {
          code: 401,
          data: {
            success: false,
            errors: [{ msg: "The user is suspended" }]
          }
        }
    

  


    // The user exists and the password is correct
    // create jwt
    const token = jwt.sign({ id: user.id_user }, process.env.SECRET, {
      expiresIn: 36000,
    });

    return {
      code: 200,
      data: {
        success: true,
        token,
        data: {
          id: user.user_id,
          email: user.email,
          phone_number: user.phone_number,
          name: user.name,
          family_name: user.family_name,
          suspended: user.suspended,
        },
      }
    }
  } catch (err) {
    console.error(err);
    return {
      code: 500,
      data: {
        success: false, errors: [{ msg: "Server error..." }]
      }
    };
  }
}

module.exports = {
    login
}
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken")

const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();



const signup = async (
                                num,
                                name,
                               family_name,
                               email,
                               phone_number,
                               password,) => {
    try {
        // Check if the user already exists
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            // User exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "user already exists"
                    }]
                },
            }
        }

         // Check if the user already exists
         const userNumber = await prisma.user.findUnique({
            where: {
                phone_number: phone_number
            }
        });
        if (userNumber) {
            // User exists
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "user already exists"
                    }]
                },
            }
        }

        // Check if the code exists and still valide
        const invitation = await prisma.invitation.findFirst({
            where:{
                code : num
            }
        })
        if(!invitation){
            // code doesnt exist
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "code doesn't exist"
                    }]
                },
            }
        }
        if(invitation.expired){
            // code expired
            return {
                code: 400,
                data: {
                    errors: [{
                        msg: "code expired"
                    }]
                },
            }
        }

        // Create new user
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(password, salt);


      

            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    family_name: family_name,
                    email: email,
                    phone_number: phone_number,
                    password: passwordHash,
                }
            })

            // code has been used now
            const updateCode = await prisma.invitation.update({
                where : {
                    code : num
                },
                data : {
                    expired : true
                }
            })


            // generate two invitations for user
                // generate two new code
                const token1 =  jwt.sign({id_user : newUser.id_user},process.env.SECRET1)
              
              
                const token2 =  jwt.sign({id_user : newUser.id_user}, process.env.SECRET2)
                console.log("here here")

            await prisma.invitation.create({
                data: {
                    id_user: newUser.id_user,
                    code : token1,
                }
            });
           await prisma.invitation.create({
                data: {
                    id_user: newUser.id_user,
                    code : token2,
                }
            });


            return {
                code: 201,
                data: {
                    success: true,
                    data: {
                        msg: "user registered",
                        code1 : token1,
                        code2 : token2
                    }
                },
            }

    } catch (err) {

        return {
            code: 500,
            data: {
              success: false, errors: [{ msg: "Server error..." }]
            }
          };
    }
}

module.exports = {
    signup
}
import prisma from "@/lib/db";

export async function POST(request: Request) {
    
    const data = await request.json();

    // verify the webhook came from Stripe

    //fufill order
    await prisma.user.update({ 
        where: {
            email: data.data.object.customer_email
        },
        data: {
            // update user data as needed
            hasAccess: true,
        },
    });


    // return a 200 response to acknowledge receipt of the webhook
    return Response.json(null, { status: 200 });
}
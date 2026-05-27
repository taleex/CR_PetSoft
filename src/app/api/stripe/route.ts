import prisma from "@/lib/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
    
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // verify the webhook came from Stripe
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Error verifying Stripe webhook:", error);
        return Response.json( null, { status: 400 });
    }

    //fufill order

    switch (event.type) {
        case "checkout.session.completed":
                await prisma.user.update({ 
                    where: {
                        email: event.data.object.customer_email
                    },
                    data: {
                        // update user data as needed
                        hasAccess: true,
                    },
                });
                break;
        default: 
            console.log(`Unhandled event type ${event.type}`);

    }

    



    // return a 200 response to acknowledge receipt of the webhook
    return Response.json(null, { status: 200 });
}
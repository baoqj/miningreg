// Script to set up Stripe products and prices for testing
// Run with: node scripts/setup-stripe.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    console.log('Setting up Stripe products and prices...');

    // Basic Plan
    const basicProduct = await stripe.products.create({
      name: 'Basic Plan',
      description: 'Unlimited legal consultation with advanced templates',
      metadata: {
        plan: 'BASIC'
      }
    });

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 2900, // $29.00 CAD
      currency: 'cad',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'BASIC'
      }
    });

    console.log('Basic Plan created:', {
      product: basicProduct.id,
      price: basicPrice.id
    });

    // Professional Plan
    const professionalProduct = await stripe.products.create({
      name: 'Professional Plan',
      description: 'Everything in Basic plus AI report generation and team collaboration',
      metadata: {
        plan: 'PROFESSIONAL'
      }
    });

    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 9900, // $99.00 CAD
      currency: 'cad',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'PROFESSIONAL'
      }
    });

    console.log('Professional Plan created:', {
      product: professionalProduct.id,
      price: professionalPrice.id
    });

    // Enterprise Plan
    const enterpriseProduct = await stripe.products.create({
      name: 'Enterprise Plan',
      description: 'Everything in Professional plus unlimited team members and custom integrations',
      metadata: {
        plan: 'ENTERPRISE'
      }
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 29900, // $299.00 CAD
      currency: 'cad',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'ENTERPRISE'
      }
    });

    console.log('Enterprise Plan created:', {
      product: enterpriseProduct.id,
      price: enterprisePrice.id
    });

    console.log('\n=== UPDATE YOUR .env FILE ===');
    console.log('Add these price IDs to your environment variables:');
    console.log(`STRIPE_PRICE_BASIC=${basicPrice.id}`);
    console.log(`STRIPE_PRICE_PROFESSIONAL=${professionalPrice.id}`);
    console.log(`STRIPE_PRICE_ENTERPRISE=${enterprisePrice.id}`);

  } catch (error) {
    console.error('Error setting up Stripe products:', error);
  }
}

if (require.main === module) {
  setupStripeProducts();
}

module.exports = { setupStripeProducts };

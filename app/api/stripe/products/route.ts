import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    // Get all products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    })

    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring'
    })

    return NextResponse.json({
      products: products.data,
      prices: prices.data
    })

  } catch (error) {
    console.error("Stripe products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === "setup") {
      // Create products and prices for the mining legal assistant
      const products = []

      // Basic Plan
      const basicProduct = await stripe.products.create({
        name: "Basic Plan",
        description: "Unlimited legal consultation with advanced templates",
        metadata: {
          plan: "BASIC"
        }
      })

      const basicPrice = await stripe.prices.create({
        product: basicProduct.id,
        unit_amount: 2900, // $29.00
        currency: "cad",
        recurring: {
          interval: "month"
        },
        metadata: {
          plan: "BASIC"
        }
      })

      products.push({ product: basicProduct, price: basicPrice })

      // Professional Plan
      const professionalProduct = await stripe.products.create({
        name: "Professional Plan",
        description: "Everything in Basic plus AI report generation and team collaboration",
        metadata: {
          plan: "PROFESSIONAL"
        }
      })

      const professionalPrice = await stripe.prices.create({
        product: professionalProduct.id,
        unit_amount: 9900, // $99.00
        currency: "cad",
        recurring: {
          interval: "month"
        },
        metadata: {
          plan: "PROFESSIONAL"
        }
      })

      products.push({ product: professionalProduct, price: professionalPrice })

      // Enterprise Plan
      const enterpriseProduct = await stripe.products.create({
        name: "Enterprise Plan",
        description: "Everything in Professional plus unlimited team members and custom integrations",
        metadata: {
          plan: "ENTERPRISE"
        }
      })

      const enterprisePrice = await stripe.prices.create({
        product: enterpriseProduct.id,
        unit_amount: 29900, // $299.00
        currency: "cad",
        recurring: {
          interval: "month"
        },
        metadata: {
          plan: "ENTERPRISE"
        }
      })

      products.push({ product: enterpriseProduct, price: enterprisePrice })

      return NextResponse.json({
        message: "Products and prices created successfully",
        products
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Stripe products creation error:", error)
    return NextResponse.json(
      { error: "Failed to create products" },
      { status: 500 }
    )
  }
}

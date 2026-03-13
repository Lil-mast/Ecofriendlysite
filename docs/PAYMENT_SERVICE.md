# PaymentService Documentation

## Overview

The **PaymentService** is the core e-commerce engine of the EcoFriendlySite platform. It enables secure, transparent purchasing and trading of verified carbon credits, making environmental action accessible to everyone. By facilitating efficient carbon credit transactions, the service directly supports the platform's mission to combat climate change.

## Purpose: Sustainable E-Commerce

### How It Enables Eco-Friendly Commerce

1. **Carbon Credit Marketplace**: Users can buy verified carbon credits from environmental projects with instant settlement
2. **Transparent Transactions**: Each purchase is recorded and traced to ensure accountability
3. **Environmental Impact**: Money from sales directly funds reforestation, renewable energy, and emissions reduction projects
4. **Decentralized Impact**: Users can invest in climate solutions globally, supporting diverse environmental initiatives

### The Circular Economy Model

```
User Calculates → Identifies Emissions Gap → Purchases Credits → Funds Projects → Reduces Atmospheric CO2
   Footprint           (1000+ tons CO2)          Climate Projects      Conservation          Impact
```

## Technical Architecture

### Technology Stack

```
Frontend (Vite + React)
        ↓
    PaymentService (Node.js)
        ↓
    ┌─────────┬──────────────┬─────────────┐
    ↓         ↓              ↓             ↓
  Stripe   PostgreSQL    MongoDB       Redis
  Payment   Orders        Credits       Cache
```

### Database Design

**PostgreSQL (Orders & Transactions)**
```sql
orders (
  order_id,
  buyer_id,
  amount (USD),
  status (pending/completed/refunded),
  stripe_payment_intent_id,
  created_at,
  updated_at
)
```

**MongoDB (Carbon Credits)**
```javascript
CarbonCredit {
  _id,
  owner (buyer_id),
  status (available/transferred/retired),
  projectId,
  verificationStandard,
  location,
  issueDate,
  methodology,
  unitAmount (kg CO2e),
  price,
  certificationDetails
}
```

## Core Components

### 1. Payment Intent Creation

**Method**: `createPaymentIntent(orderData, buyerId)`

**Purpose**: Initialize a carbon credit purchase

**Process Flow**:
```javascript
1. Receive order request from user
   {
     amount: 500,           // USD cost for credits
     creditIds: [id1, id2], // Carbon credits to purchase
     quantity: 50           // Tons of CO2e offset
   }

2. Create Stripe PaymentIntent
   - Amount: $500 (converted to cents: 50000)
   - Currency: USD
   - Metadata: buyerId, creditIds, quantity

3. Log pending order to PostgreSQL
   - Status: 'pending'
   - Tracks which credits are being purchased
   - Links Stripe transaction to database

4. Return payment details to frontend
   - Front-end displays payment UI (Stripe checkout)
   - Customer completes payment
```

**Response Example**:
```javascript
{
  id: "pi_1234567890",
  amount: 50000,
  currency: "usd",
  status: "requires_payment_method",
  metadata: {
    buyerId: "user_123",
    creditIds: "[\"credit_1\", \"credit_2\"]",
    quantity: 50
  }
}
```

### 2. Webhook Processing

**Method**: `processPaymentWebhook(event)`

**Purpose**: Handle successful payment confirmation from Stripe

**Security**: 
- Stripe sends signed webhooks to prevent tampering
- Webhook secret validates authenticity
- Only processes `payment_intent.succeeded` events

**Process Flow**:
```javascript
1. Stripe → Webhook Event (payment succeeded)
   
2. Extract transaction metadata
   const { buyerId, creditIds } = paymentIntent.metadata
   
3. Update order status in PostgreSQL
   status: 'pending' → status: 'completed'
   
4. Transfer carbon credits to buyer
   CarbonCredit.owner = buyerId
   CarbonCredit.status = 'transferred'
   
5. Confirm transaction completion
   Return: { success: true, paymentIntentId: "pi_..." }
```

**Webhook Format**:
```javascript
{
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_1234567890",
      amount: 50000,
      metadata: {
        buyerId: "user_123",
        creditIds: "[\"credit_1\", \"credit_2\"]"
      }
    }
  }
}
```

### 3. Credit Transfer

**Method**: `transferCredits(buyerId, creditIds)`

**Purpose**: Move carbon credits from inventory to buyer's account

**Process**:
```javascript
Loop through each carbon credit:
  1. Find credit in MongoDB by ID
  2. Update owner to buyerId
  3. Mark status as 'transferred'
  4. Return updated credit

Result: Credits are now in buyer's possession
```

**MongoDB Update**:
```javascript
{
  _id: ObjectId("credit_123"),
  owner: "user_123",           // ← Updated
  status: "transferred",       // ← Updated
  projectId: "afforest_001",
  unitAmount: 1,               // 1 ton CO2e
  price: 10                    // $10
}
```

### 4. Order History

**Method**: `getOrderHistory(buyerId)`

**Purpose**: Provide transaction history for users

**Returns**:
```javascript
[
  {
    order_id: 1,
    buyer_id: "user_123",
    amount: 500,
    status: "completed",
    stripe_payment_intent_id: "pi_123",
    created_at: "2026-03-10T14:23:00Z"
  },
  {
    order_id: 2,
    buyer_id: "user_123",
    amount: 250,
    status: "completed",
    stripe_payment_intent_id: "pi_456",
    created_at: "2026-03-09T10:15:00Z"
  }
]
```

### 5. Refund Processing

**Method**: `refundPayment(paymentIntentId, reason)`

**Purpose**: Handle customer refunds and reversals

**Process**:
```javascript
1. Send refund request to Stripe
   - Links to original payment
   - Records refund reason
   
2. Stripe processes refund
   - Returns funds to customer's card/account
   - Usually within 5-10 business days
   
3. Update order status
   status: 'completed' → status: 'refunded'
   
4. Optionally reverse credit transfer
   (Manual process to reassign credits)
```

## Complete Payment Flow

### User Journey

```
1. USER BROWSES CREDITS
   ├─ Views available carbon credits
   ├─ Filters by project type (Reforestation, Renewable Energy, etc.)
   └─ Reviews certification (Gold Standard, VCS, etc.)

2. USER INITIATES PURCHASE
   ├─ Adds credits to cart (e.g., 50 tons CO2e)
   ├─ Frontend calls: createPaymentIntent()
   └─ PaymentService creates Stripe intent

3. USER COMPLETES PAYMENT
   ├─ Enters payment details (Card, Apple Pay, etc.)
   ├─ Stripe processes securely
   └─ Returns confirmation to frontend

4. STRIPE SENDS WEBHOOK
   ├─ Confirms payment success
   ├─ PaymentService processes webhook
   ├─ Updates order in PostgreSQL
   └─ Transfers credits in MongoDB

5. USER RECEIVES CREDITS
   ├─ Sees credits in dashboard
   ├─ Can view certificate/documentation
   ├─ Impact counted toward reduction goals
   └─ Emissions offset processed

6. ENVIRONMENTAL IMPACT
   ├─ Funds flows to project
   ├─ Project uses capital for conservation
   ├─ CO2e reduction occurs
   └─ Global impact tracked
```

## Error Handling & Security

### Try-Catch Error Handling

Each method includes comprehensive error handling:

```javascript
async createPaymentIntent(orderData, buyerId) {
  try {
    // ... payment logic
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw new Error('Failed to create payment intent');
  }
}
```

### Security Measures

1. **Stripe Integration**
   - PCI-DSS compliant (no card data stored locally)
   - Webhook signature verification
   - Secure API keys loaded from environment

2. **Database Security**
   - Parameterized queries prevent SQL injection
   - MongoDB ObjectId validation
   - Transaction logging for audit trails

3. **Data Protection**
   - Sensitive data encrypted in transit (HTTPS)
   - Environment variables for secrets (not hardcoded)
   - Metadata stored securely with transaction

## Integration Points

### API Endpoints Example

```javascript
// POST /api/credits/purchase
app.post('/api/credits/purchase', async (req, res) => {
  const paymentService = new PaymentService();
  const { orderData, buyerId } = req.body;
  
  try {
    const paymentIntent = await paymentService.createPaymentIntent(orderData, buyerId);
    res.json(paymentIntent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/webhooks/stripe
app.post('/api/webhooks/stripe', async (req, res) => {
  const paymentService = new PaymentService();
  
  try {
    const event = JSON.parse(req.body);
    await paymentService.processPaymentWebhook(event);
    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/orders/:buyerId
app.get('/api/orders/:buyerId', async (req, res) => {
  const paymentService = new PaymentService();
  
  try {
    const orders = await paymentService.getOrderHistory(req.params.buyerId);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Eco-Friendly Commerce Benefits

### For Users

1. **Easy Offset**: One-click carbon credit purchase to neutralize your footprint
2. **Verified Impact**: Every credit backed by certified environmental projects
3. **Transparency**: Track where your money goes and what impact it creates
4. **Flexibility**: Buy as much or as little as you need, anytime

### For Projects

1. **Sustainable Funding**: Revenue from credit sales supports conservation work
2. **Global Reach**: Connect with environmentally conscious buyers worldwide
3. **Fair Pricing**: Direct marketplace reduces middlemen, more funds reach projects
4. **Impact Verification**: Database-backed records and certified standards ensure credibility

### For the Planet

1. **Emission Reduction**: Billions of USD channeled to climate action
2. **Reforestation**: Tree-planting projects receive direct funding
3. **Renewable Energy**: Support for solar, wind, and clean energy transition
4. **Biodiversity**: Wetland restoration and species protection projects funded

## Configuration

### Environment Variables Required

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# MongoDB
MONGODB_URI=mongodb://localhost:27017/econexus_carbon

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=econexus_commerce
PG_USER=postgres
PG_PASSWORD=password

# External APIs (optional for enhanced features)
ELECTRICITYMAP_API_KEY=xxxxx
HERE_API_KEY=xxxxx
ORS_API_KEY=xxxxx
OPENWEATHER_API_KEY=xxxxx
```

## Testing

### Test Stripe Payments Locally

```bash
# 1. Use Stripe's test card numbers
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002

# 2. Test webhook locally with stripe-cli
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Trigger test events
stripe trigger payment_intent.succeeded
```

## Future Enhancements

1. **Recurring Credits**: Auto-offset subscriptions
2. **Carbon Futures**: Pre-purchase credits for future offset
3. **Enhanced Security**: Advanced encryption and audit trails
4. **Mobile App**: iOS/Android for on-the-go purchasing
5. **API for Businesses**: Bulk purchasing and corporate offsetting
6. **Secondary Market**: Peer-to-peer credit trading

## Support

For issues or questions about the PaymentService:

1. Check logs: `console.error()` messages in server
2. Review Stripe dashboard for payment details
3. Verify environment variables are set
4. Check database connections (PostgreSQL, MongoDB)
5. Contact: [Tazma](mailto:contact@tazma.com)

---

**Last Updated**: March 10, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

# Tagging Guide - Quick Reference

A quick reference for tagging articles in the Mearth Article Publisher.

---

## Primary Category (Required - Choose 1)

| Category | Use For |
|----------|---------|
| **Leadership & Coordination** | Decision-making, governance, policy, coordination frameworks |
| **Technology & Engineering** | Technical systems, engineering solutions, R&D, innovation |
| **Economic Models** | Financial systems, business models, economic frameworks |
| **Legal & Regulatory** | Laws, regulations, compliance, policy frameworks |
| **Environment & Resources** | Environmental systems, natural resources, sustainability |
| **Supply Chain & Logistics** | Transportation, distribution, supply networks |
| **Energy Systems** | Power generation, storage, distribution |
| **Infrastructure** | Physical systems, built environment, facilities |
| **Human Factors** | Psychology, behavior, social dynamics, culture |
| **Safety & Risk** | Risk management, safety protocols, security |
| **Communications** | Information flow, messaging, data transmission |
| **Operations & Management** | Day-to-day operations, management practices |
| **Research & Analysis** | Studies, reports, data analysis, findings |
| **Education & Training** | Learning, skill development, knowledge transfer |

---

## PMH Classification Zones (Select 1-3)

### Early Planning (1-5)
1. **Initial Concept** - First ideas and vision
2. **Feasibility Study** - Can it be done?
3. **Strategy Development** - How will we do it?
4. **Stakeholder Engagement** - Who needs to be involved?
5. **Resource Planning** - What do we need?

### Implementation (6-10)
6. **Design & Architecture** - Detailed plans
7. **Prototype & Testing** - Proof of concept
8. **Manufacturing & Production** - Building it
9. **Deployment & Installation** - Putting it in place
10. **Integration** - Making systems work together

### Operations (11-15)
11. **Operations & Maintenance** - Running it
12. **Monitoring & Evaluation** - Is it working?
13. **Optimization** - Making it better
14. **Scaling & Expansion** - Growing it
15. **Legacy & Transition** - Long-term sustainability

---

## MegaChallenges (Select Any - No Ranking)

These six challenges are interconnected and exist simultaneously:

| Challenge | Description |
|-----------|-------------|
| **Climate Change** | Global warming, carbon emissions, climate adaptation |
| **Mass Extinction** | Loss of species, biodiversity collapse |
| **Ecosystems Collapse** | Breakdown of natural systems and food chains |
| **Displacement** | Forced migration, refugees, population movement |
| **Unrest** | Social instability, conflict, inequality |
| **Explosive Impact** | Catastrophic events, system shocks, cascading failures |

💡 **Tip:** Select all challenges that the article addresses. Many articles will touch on multiple challenges.

---

## Topics (Select 2-5)

Common topics include:

**Systems & Strategy:**
- Supply Chain
- Resilience
- Logistics
- Systems Thinking
- Strategy
- Coordination
- Decision-Making

**Technical & Innovation:**
- Technology
- Innovation
- Infrastructure
- Moon
- Mearth

**Business & Society:**
- Economy
- Leadership
- Sustainability

💡 **Tip:** Add more topics by editing `data/topics.json`

---

## Entity Associations (Select Any)

Link articles to specific Mearth entities:

| Entity | Description |
|--------|-------------|
| **MearthLink** | Connectivity and communications infrastructure |
| **Mearth Space Industries** | Manufacturing and industrial operations |
| **Mearth Cultiva** | Agricultural and food production systems |
| **Mearth Habitus** | Human habitation and life support |
| **Mearth Energy** | Power generation and distribution |
| **Mearth Eterna** | Long-term sustainability and legacy |
| **PMH Foundation** | The foundational coordinating organization |

💡 **Tip:** Only select entities directly referenced in the article.

---

## Tagging Best Practices

### DO:
✅ Choose the **most specific** primary category  
✅ Select **2-3 PMH Zones** that best fit the content  
✅ Check **all relevant** MegaChallenges  
✅ Use **3-5 topics** for best searchability  
✅ Only tag entities **explicitly mentioned** in the article  

### DON'T:
❌ Select "everything" just to be safe  
❌ Skip primary category (it's required)  
❌ Use only 1 topic (articles are usually about multiple things)  
❌ Tag entities not referenced in the content  

---

## Example: Supply Chain Article

**Article:** "Resilient Supply Chains for Lunar Operations"

**Tagging:**
- **Primary Category:** Supply Chain & Logistics
- **PMH Zones:** 
  - 3 (Strategy Development)
  - 6 (Design & Architecture)
  - 11 (Operations & Maintenance)
- **MegaChallenges:**
  - Explosive Impact (system shocks)
  - Displacement (resource constraints)
- **Topics:**
  - Supply Chain
  - Resilience
  - Moon
  - Logistics
  - Systems Thinking
- **Entities:**
  - MearthLink (if mentioned)
  - Mearth Space Industries (if mentioned)

---

## Example: Climate Research Article

**Article:** "Ecosystem Monitoring for Climate Adaptation"

**Tagging:**
- **Primary Category:** Environment & Resources
- **PMH Zones:**
  - 2 (Feasibility Study)
  - 12 (Monitoring & Evaluation)
  - 13 (Optimization)
- **MegaChallenges:**
  - Climate Change
  - Ecosystems Collapse
  - Mass Extinction
- **Topics:**
  - Sustainability
  - Systems Thinking
  - Technology
  - Resilience
  - Innovation
- **Entities:**
  - Mearth Cultiva (if agricultural systems mentioned)
  - Mearth Eterna (if long-term focus)

---

## Need to Add New Options?

### Adding Topics
Edit `data/topics.json`:
```json
{
  "id": "new-topic-slug",
  "name": "New Topic Name",
  "slug": "new-topic-slug"
}
```

### Adding Entities
Edit `data/entities.json`:
```json
{
  "id": "new-entity-slug",
  "name": "New Entity Name",
  "slug": "new-entity-slug",
  "description": "Description here"
}
```

Restart the server after editing JSON files.

---

**Happy tagging! 🏷️**

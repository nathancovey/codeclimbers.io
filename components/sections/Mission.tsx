import { Card, CardContent } from '../ui/card'
import { Highlight } from '../ui/highlight'
const manifestoPoints = [
  <>
    We are obsessive about <Highlight>the little details</Highlight>
  </>,
  <>
    We personally <Highlight>use our products</Highlight> and practice what we preach
  </>,
  <>
    Do things that <Highlight>don't scale</Highlight>: automation should be avoided where possible, especially when it comes to <Highlight>interactions with others</Highlight>
  </>,
  <>
    We strive to be <Highlight>givers</Highlight> in our relationships
  </>,
  <>
    We believe in being a <Highlight>net positive</Highlight> to the communities we serve. Revenue is a measure of value created but in the case of many apps can often lead to sacrificing individuals' well-being for the benefit of a business. As we pursue revenue, we are committed to <Highlight>giving value</Highlight> to individuals instead of extracting value from them.
  </>,
]

export function Mission() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto overflow-hidden">
          <CardContent className="p-8 md:p-10 text-left">
            <h2 className="text-3xl font-bold mb-8 text-foreground leading-tight">
              Manifesto
            </h2>
            <div className="space-y-4">
              {manifestoPoints.map((point, index) => (
                <p key={index} className="text-muted-foreground text-lg leading-relaxed">
                  {point}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
} 
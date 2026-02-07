import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Phone, MessageCircle, Shield, Heart } from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'National Domestic Violence Hotline',
      description: 'Free, confidential support 24/7 for victims and survivors',
      phone: '1-800-799-7233',
      website: 'https://www.thehotline.org',
      icon: Phone,
    },
    {
      title: 'RAINN (Rape, Abuse & Incest National Network)',
      description: 'National Sexual Assault Hotline and online chat support',
      phone: '1-800-656-4673',
      website: 'https://www.rainn.org',
      icon: MessageCircle,
    },
    {
      title: 'National Center for Victims of Crime',
      description: 'Resources, advocacy, and support for crime victims',
      website: 'https://victimsofcrime.org',
      icon: Shield,
    },
    {
      title: 'Stalking Prevention, Awareness, and Resource Center (SPARC)',
      description: 'Information and resources specifically about stalking',
      website: 'https://www.stalkingawareness.org',
      icon: Shield,
    },
    {
      title: 'National Coalition Against Domestic Violence',
      description: 'Advocacy, resources, and state-by-state information',
      website: 'https://ncadv.org',
      icon: Heart,
    },
    {
      title: 'VictimConnect Resource Center',
      description: 'Referrals to local services and support',
      phone: '1-855-484-2846',
      website: 'https://victimconnect.org',
      icon: Phone,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-black">Crime Help Resources</h2>
        <p className="text-muted-foreground mt-1">
          National hotlines and support organizations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card key={index} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5 text-primary" />
                  {resource.title}
                </CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resource.phone && (
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground">Phone: </span>
                    <a
                      href={`tel:${resource.phone.replace(/\D/g, '')}`}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {resource.phone}
                    </a>
                  </div>
                )}
                {resource.website && (
                  <div>
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                    >
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Emergency</CardTitle>
          <CardDescription>If you are in immediate danger</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">Call 911</p>
          <p className="text-sm text-muted-foreground mt-1">
            For immediate emergency assistance, always call your local emergency services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

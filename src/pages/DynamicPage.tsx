import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (pageError) throw pageError;
      
      if (!pageData) {
        navigate('/404');
        return;
      }

      setPage(pageData);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('is_active', true)
        .order('sort_order');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);
    } catch (error: any) {
      console.error('Error loading page:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>{page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
      </Helmet>
      <Header />
      <main className="flex-1">
        {sections.map((section) => (
          <div key={section.id}>
            {section.section_type === 'hero' && (
              <section
                className="relative h-[500px] flex items-center justify-center"
                style={{
                  backgroundImage: section.section_data.image_url
                    ? `url(${section.section_data.image_url})`
                    : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="container relative z-10 text-center text-white">
                  <h1 className="text-5xl font-bold mb-4" style={{ fontSize: section.section_data.titleSize }}>
                    {section.section_data.title}
                  </h1>
                  <p className="text-xl mb-6" style={{ fontSize: section.section_data.subtitleSize }}>
                    {section.section_data.subtitle}
                  </p>
                  {section.section_data.button_text && section.section_data.button_url && (
                    <a
                      href={section.section_data.button_url}
                      className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      {section.section_data.button_text}
                    </a>
                  )}
                </div>
              </section>
            )}

            {section.section_type === 'text' && (
              <section className="py-16">
                <div className="container">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6" style={{ fontSize: section.section_data.titleSize }}>
                      {section.section_data.title}
                    </h2>
                    <div
                      className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                      style={{ fontSize: section.section_data.contentSize }}
                    >
                      {section.section_data.content}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {section.section_type === 'image' && (
              <section className="py-8">
                <div className="container">
                  <img
                    src={section.section_data.image_url}
                    alt={section.section_data.alt || ''}
                    className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
                  />
                </div>
              </section>
            )}

            {section.section_type === 'cta' && (
              <section className="py-16">
                <div className="container">
                  <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4" style={{ fontSize: section.section_data.titleSize }}>
                      {section.section_data.title}
                    </h2>
                    <p className="text-xl mb-8 opacity-90" style={{ fontSize: section.section_data.descriptionSize }}>
                      {section.section_data.description}
                    </p>
                    {section.section_data.button_text && section.section_data.button_url && (
                      <a
                        href={section.section_data.button_url}
                        className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-medium hover:shadow-lg transition-shadow"
                      >
                        {section.section_data.button_text}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default DynamicPage;

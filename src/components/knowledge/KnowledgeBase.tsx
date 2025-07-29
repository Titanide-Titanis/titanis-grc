import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Star, 
  FileText, 
  Video, 
  Download,
  HelpCircle,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export const KnowledgeBase: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All Articles" },
    { value: "Getting Started", label: "Getting Started" },
    { value: "Risk Management", label: "Risk Management" },
    { value: "Compliance", label: "Compliance" },
    { value: "Resources", label: "Free Resources" },
    { value: "Support", label: "Support & Training" }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("knowledge_base_articles")
        .select("*")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base articles.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleView = async (articleId: string) => {
    try {
      const { data: article } = await supabase
        .from("knowledge_base_articles")
        .select("view_count")
        .eq("id", articleId)
        .single();
      
      if (article) {
        await supabase
          .from("knowledge_base_articles")
          .update({ view_count: article.view_count + 1 })
          .eq("id", articleId);
      }
      
      // Update local state
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, view_count: article.view_count + 1 }
          : article
      ));
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.is_featured);
  const regularArticles = filteredArticles.filter(article => !article.is_featured);

  const renderArticleCard = (article: Article) => (
    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleArticleView(article.id)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
              {article.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            </div>
            <Badge variant="secondary">{article.category}</Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            {article.view_count}
          </div>
        </div>
        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-4">
          {article.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.tags.length - 3} more
            </Badge>
          )}
        </div>
        <div className="prose prose-sm max-w-none text-muted-foreground line-clamp-3">
          {article.content.substring(0, 200)}...
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Find guides, tutorials, and resources to help you get the most out of TITANIS™
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.open("https://support.titanideholdings.com/portal/en/home", "_blank")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Support Portal
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-6">
            {categories.map(category => (
              <TabsTrigger key={category.value} value={category.value} className="text-xs lg:text-sm">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map(renderArticleCard)}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {featuredArticles.length > 0 ? "More Articles" : "Articles"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map(renderArticleCard)}
              </div>
            </div>
          )}

          {/* No Articles Found */}
          {filteredArticles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse a different category.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                      <div className="h-3 bg-muted rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Access Cards */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open("https://www.titanideconsulting.com/resources/tools/free", "_blank")}>
            <CardHeader className="text-center">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Free GRC Templates</CardTitle>
              <CardDescription>Download free templates and tools</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open("https://support.titanideholdings.com/portal/en/home", "_blank")}>
            <CardHeader className="text-center">
              <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Support Portal</CardTitle>
              <CardDescription>Get help and submit tickets</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open("mailto:support@titanideconsulting.com", "_blank")}>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Email Support</CardTitle>
              <CardDescription className="break-words">support@titanideconsulting.com</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open("https://www.titanideconsulting.com/solutions/digital-products/kj-advisor", "_blank")}>
            <CardHeader className="text-center">
              <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">KJ Advisor GPTs</CardTitle>
              <CardDescription>AI-powered GRC advisory</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open("mailto:sales@titanideconsulting.com", "_blank")}>
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Sales Inquiries</CardTitle>
              <CardDescription className="break-words">sales@titanideconsulting.com</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Support Information */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Our support team is here to help you succeed with TITANIS™. Get in touch through any of these channels:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Support Portal:</span>
              <br />
              <a 
                href="https://support.titanideholdings.com/portal/en/home" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-words"
              >
                support.titanideholdings.com
              </a>
            </div>
            <div>
              <span className="font-medium">US Support:</span>
              <br />
              <a 
                href="tel:+18326130619"
                className="text-primary hover:underline"
              >
                +1-832-613-0619
              </a>
            </div>
            <div>
              <span className="font-medium">UK/EU Support:</span>
              <br />
              <a 
                href="tel:+442037251643"
                className="text-primary hover:underline"
              >
                +44 2037251643
              </a>
            </div>
            <div>
              <span className="font-medium">Email Support:</span>
              <br />
              <a 
                href="mailto:support@titanideconsulting.com"
                className="text-primary hover:underline break-words"
              >
                support@titanideconsulting.com
              </a>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4" />
              <span className="font-medium">KJ Advisor GPTs</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Get AI-powered GRC advisory support through our advanced KJ Advisor platform
            </p>
            <a 
              href="https://www.titanideconsulting.com/solutions/digital-products/kj-advisor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Access KJ Advisor →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
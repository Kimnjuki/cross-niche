/**
 * Simple Homepage - Basic layout to isolate React Error #300
 */

import { Layout } from '@/components/layout/Layout';
import { mockArticles } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Brain, Gamepad2 } from 'lucide-react';
import type { Article } from '@/types';

export default function IndexSimple() {
  // Use only mock data to avoid React errors from multiple hooks
  const articles: Article[] = mockArticles.slice(0, 12);
  const topStory = articles[0];
  const mainFeed = articles.slice(1, 11);

  return (
    <Layout showPulseSidebar={false}>
      <SEOHead
        title="The Grid Nexus – Tech, Security & Gaming News"
        description="Breaking technology news, cybersecurity analysis, and gaming guides. One hub for tech, security, and gaming intelligence."
        keywords={[
          'tech news',
          'cybersecurity',
          'gaming news',
          'technology',
          'security threats',
        ]}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {' '}Tech Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Experience the intersection of technology, security, and gaming with AI-powered insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/security"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Security Tools
              </Link>
              
              <Link
                to="/tech"
                className="px-8 py-4 border border-blue-400/30 text-blue-400 rounded-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Tech News
              </Link>
              
              <Link
                to="/gaming"
                className="px-8 py-4 border border-purple-400/30 text-purple-400 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Gaming
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Story */}
      {topStory && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Story</h2>
              <p className="text-gray-600 dark:text-gray-400">Today's top technology news</p>
            </div>
            <ArticleCard article={topStory} />
          </div>
        </section>
      )}

      {/* Main Feed */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Stories</h2>
              <p className="text-gray-600 dark:text-gray-400">Fresh technology and security updates</p>
            </div>
            <Link
              to="/explore"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeed.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Categories</h2>
            <p className="text-gray-600 dark:text-gray-400">Dive into your favorite topics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/tech"
              className="group p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Technology
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Latest tech news, AI developments, and digital innovation
              </p>
            </Link>

            <Link
              to="/security"
              className="group p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Security
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Cybersecurity threats, vulnerabilities, and protection strategies
              </p>
            </Link>

            <Link
              to="/gaming"
              className="group p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Gaming
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Gaming news, reviews, and industry insights
              </p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

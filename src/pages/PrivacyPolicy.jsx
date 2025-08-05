import React from 'react';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Learn how we protect your privacy and handle your personal information
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: January 15, 2024</p>
        </div>

        {/* Privacy Commitment */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Privacy Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Security</h3>
              <p className="text-gray-600 text-sm">Your data is encrypted and securely stored</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">Clear information about data usage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
              <p className="text-gray-600 text-sm">You control your personal information</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h3>
                <p className="text-gray-600 mb-4">
                  At FollowerCarts, we are committed to protecting your privacy and ensuring the security 
                  of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you use our website and services.
                </p>
                <p className="text-gray-600">
                  By using FollowerCarts, you agree to the collection and use of information in accordance 
                  with this Privacy Policy. If you do not agree with our policies and practices, do not use our services.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                    <p className="text-gray-600 mb-2">
                      We may collect the following personal information when you use our services:
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1 ml-4">
                      <li>• Email address</li>
                      <li>• Name (if provided)</li>
                      <li>• Payment information (processed securely by third-party providers)</li>
                      <li>• Social media usernames or URLs (for service delivery)</li>
                      <li>• Communication preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Technical Information</h4>
                    <p className="text-gray-600 mb-2">
                      We automatically collect certain technical information:
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1 ml-4">
                      <li>• IP address and device information</li>
                      <li>• Browser type and version</li>
                      <li>• Operating system</li>
                      <li>• Pages visited and time spent</li>
                      <li>• Referral source</li>
                      <li>• Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h3>
                <p className="text-gray-600 mb-4">
                  We use the collected information for the following purposes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Service Delivery</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Process and fulfill orders</li>
                      <li>• Deliver purchased services</li>
                      <li>• Provide customer support</li>
                      <li>• Send order confirmations</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Communication</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Send important updates</li>
                      <li>• Respond to inquiries</li>
                      <li>• Provide customer support</li>
                      <li>• Send promotional content (opt-in)</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Improvement</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Analyze website usage</li>
                      <li>• Improve our services</li>
                      <li>• Enhance user experience</li>
                      <li>• Develop new features</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Legal Compliance</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Comply with legal obligations</li>
                      <li>• Prevent fraud and abuse</li>
                      <li>• Protect user rights</li>
                      <li>• Maintain security</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h3>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information only in the following circumstances:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Service Providers</h4>
                      <p className="text-gray-600 text-sm">
                        With trusted third-party providers who help us deliver our services (payment processors, hosting providers)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Legal Requirements</h4>
                      <p className="text-gray-600 text-sm">
                        When required by law, regulation, or legal process
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Protection of Rights</h4>
                      <p className="text-gray-600 text-sm">
                        To protect our rights, property, or safety, or that of our users or others
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h3>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Security Measures Include:</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure servers and databases</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Access controls and authentication</li>
                    <li>• Employee training on data protection</li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h3>
                <p className="text-gray-600 mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Access and Update</h4>
                    <p className="text-gray-600 text-sm">
                      Request access to your personal information and update inaccurate data
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Data Portability</h4>
                    <p className="text-gray-600 text-sm">
                      Request a copy of your data in a portable format
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Deletion</h4>
                    <p className="text-gray-600 text-sm">
                      Request deletion of your personal information (subject to legal requirements)
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Marketing Opt-out</h4>
                    <p className="text-gray-600 text-sm">
                      Unsubscribe from marketing communications at any time
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h3>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience. 
                  Cookies help us remember your preferences, analyze website traffic, and provide personalized content.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Types of Cookies We Use:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Essential cookies for website functionality</li>
                    <li>• Analytics cookies to understand website usage</li>
                    <li>• Preference cookies to remember your settings</li>
                    <li>• Marketing cookies for personalized advertising (with consent)</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> privacy@followercarts.com</p>
                    <p><strong>Support:</strong> Available 24/7 via live chat</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Updates Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Policy Updates</h3>
          <p className="text-yellow-700 text-sm">
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new policy on this page and updating the "Last updated" date. 
            Your continued use of our services after such modifications constitutes acceptance of the updated policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
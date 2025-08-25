// Validation Script for Eco-Explorer Website Improvements
const fs = require('fs');
const path = require('path');

class WebsiteValidator {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.successes = [];
    }

    validate() {
        console.log('🔍 Starting Eco-Explorer Website Validation...\n');

        this.checkTranslationKeys();
        this.checkJavaScriptFiles();
        this.checkCSSFiles();
        this.checkHTMLStructure();

        this.printReport();
    }

    checkTranslationKeys() {
        console.log('📝 Checking Translation Keys...');

        const locales = ['en', 'es', 'fr', 'pt'];
        const localeData = {};

        // Load all locale files
        locales.forEach(locale => {
            try {
                const content = JSON.parse(fs.readFileSync(`locales/${locale}.json`, 'utf8'));
                localeData[locale] = content;
            } catch (error) {
                this.issues.push(`❌ Failed to load ${locale}.json: ${error.message}`);
            }
        });

        // Check for consistency across locales
        const enKeys = Object.keys(localeData.en || {});
        const totalKeys = enKeys.length;

        Object.entries(localeData).forEach(([locale, data]) => {
            const localeKeys = Object.keys(data);
            const missingKeys = enKeys.filter(key => !data[key]);
            const extraKeys = localeKeys.filter(key => !enKeys.includes(key));

            if (missingKeys.length > 0) {
                this.issues.push(`❌ ${locale}.json missing ${missingKeys.length} keys: ${missingKeys.slice(0, 5).join(', ')}`);
            }

            if (extraKeys.length > 0) {
                this.warnings.push(`⚠️ ${locale}.json has ${extraKeys.length} extra keys: ${extraKeys.slice(0, 3).join(', ')}`);
            }

            if (missingKeys.length === 0 && extraKeys.length === 0) {
                this.successes.push(`✅ ${locale}.json has all ${totalKeys} keys`);
            }
        });
    }

    checkJavaScriptFiles() {
        console.log('🟨 Checking JavaScript Files...');

        const jsFiles = [
            'assets/js/newsletter-enhanced.js',
            'assets/js/chatbot-enhanced.js'
        ];

        jsFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n').length;

                // Check for basic structure
                if (content.includes('class') || content.includes('function')) {
                    this.successes.push(`✅ ${file} loaded (${lines} lines)`);
                } else {
                    this.warnings.push(`⚠️ ${file} may be malformed`);
                }

                // Check for specific functionality
                if (file.includes('newsletter') && content.includes('NewsletterManager')) {
                    this.successes.push(`✅ NewsletterManager class found`);
                }

                if (file.includes('chatbot') && content.includes('ChatbotManager')) {
                    this.successes.push(`✅ ChatbotManager class found`);
                }
            } else {
                this.issues.push(`❌ ${file} not found`);
            }
        });
    }

    checkCSSFiles() {
        console.log('🎨 Checking CSS Files...');

        const cssFiles = [
            'assets/css/enhanced.css'
        ];

        cssFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n').length;

                this.successes.push(`✅ ${file} loaded (${lines} lines)`);

                // Check for key styles
                const keyStyles = ['.status-message', '.chatbot-loading', '.error-message'];
                keyStyles.forEach(style => {
                    if (content.includes(style)) {
                        this.successes.push(`✅ ${style} found in CSS`);
                    } else {
                        this.warnings.push(`⚠️ ${style} not found in CSS`);
                    }
                });
            } else {
                this.issues.push(`❌ ${file} not found`);
            }
        });
    }

    checkHTMLStructure() {
        console.log('🏗️ Checking HTML Structure...');

        const htmlFile = 'index.html';
        if (fs.existsSync(htmlFile)) {
            const content = fs.readFileSync(htmlFile, 'utf8');
            const lines = content.split('\n').length;

            this.successes.push(`✅ index.html loaded (${lines} lines)`);

            // Check for key elements
            const keyElements = [
                'id="chatbot-container"',
                'id="newsletter-form"',
                'data-translate="brandName"',
                'assets/js/newsletter-enhanced.js',
                'assets/js/chatbot-enhanced.js',
                'assets/css/enhanced.css'
            ];

            keyElements.forEach(element => {
                if (content.includes(element)) {
                    this.successes.push(`✅ ${element} found in HTML`);
                } else {
                    this.issues.push(`❌ ${element} not found in HTML`);
                }
            });

            // Check for translation attributes
            const translateCount = (content.match(/data-translate/g) || []).length;
            this.successes.push(`✅ Found ${translateCount} translation attributes`);

            // Check for duplicate comments
            const privacyNoticeCount = (content.match(/Privacy Notice/g) || []).length;
            if (privacyNoticeCount <= 1) {
                this.successes.push(`✅ No duplicate Privacy Notice comments`);
            } else {
                this.warnings.push(`⚠️ Found ${privacyNoticeCount} Privacy Notice comments`);
            }

        } else {
            this.issues.push(`❌ index.html not found`);
        }
    }

    printReport() {
        console.log('\n📊 VALIDATION REPORT\n');

        if (this.successes.length > 0) {
            console.log('✅ SUCCESSES:');
            this.successes.forEach(success => console.log(`   ${success}`));
            console.log('');
        }

        if (this.warnings.length > 0) {
            console.log('⚠️ WARNINGS:');
            this.warnings.forEach(warning => console.log(`   ${warning}`));
            console.log('');
        }

        if (this.issues.length > 0) {
            console.log('❌ ISSUES:');
            this.issues.forEach(issue => console.log(`   ${issue}`));
            console.log('');
        }

        const totalChecks = this.successes.length + this.warnings.length + this.issues.length;
        const successRate = Math.round((this.successes.length / totalChecks) * 100);

        console.log(`📈 SUCCESS RATE: ${successRate}% (${this.successes.length}/${totalChecks})`);

        if (this.issues.length === 0) {
            console.log('🎉 All critical issues resolved!');
        } else {
            console.log('🔧 Some issues remain to be addressed.');
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new WebsiteValidator();
    validator.validate();
}

module.exports = WebsiteValidator;

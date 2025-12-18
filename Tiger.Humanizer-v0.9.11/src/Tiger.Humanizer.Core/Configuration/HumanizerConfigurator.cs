using System;
using Tiger.Humanizer.Inflections;

namespace Tiger.Humanizer.Configuration
{
    /// <summary>
    /// Central configuration entry point for Humanizer behaviors.
    /// </summary>
    public static class Configurator
    {
        private static ICollectionFormatter _collectionFormatter = new OxfordCommaCollectionFormatter();
        private static IVocabulary _vocabulary = new DefaultVocabulary();

        /// <summary>
        /// Gets or sets the formatter used for collection humanization.
        /// </summary>
        public static ICollectionFormatter CollectionFormatter
        {
            get => _collectionFormatter;
            set => _collectionFormatter = value ?? throw new ArgumentNullException(nameof(value));
        }

        /// <summary>
        /// Gets or sets the vocabulary used for pluralization and singularization.
        /// </summary>
        public static IVocabulary Vocabulary
        {
            get => _vocabulary;
            set => _vocabulary = value ?? new DefaultVocabulary();
        }
    }
}

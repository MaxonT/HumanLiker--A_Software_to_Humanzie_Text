const express = require('express');
const router = express.Router();

const Truncator = require('../core/Truncator');
const EnumProcessor = require('../core/EnumProcessor');
const HeadingConverter = require('../core/HeadingConverter');
const TupleConverter = require('../core/TupleConverter');

/**
 * Consolidated route for advanced utility modules
 */
router.post('/process', (req, res) => {
  try {
    const { module, operation } = req.body;

    switch (module) {
      case 'truncator': {
        const { input, length, from, strategy, ellipsis } = req.body;
        const output = Truncator.truncate(input, length, strategy, from, ellipsis);
        return res.json({ success: true, output });
      }

      case 'enum': {
        const { value, casing, values, delimiter } = req.body;
        let output;

        if (operation === 'dehumanize') {
          output = EnumProcessor.dehumanize(value);
        } else if (operation === 'list') {
          output = EnumProcessor.list(values, delimiter || 'and', casing);
        } else if (operation === 'parseFlags') {
          output = EnumProcessor.parseFlags(value, delimiter);
        } else {
          output = EnumProcessor.humanize(value, casing);
        }

        return res.json({ success: true, output });
      }

      case 'heading': {
        const { degrees, direction } = req.body;
        let output;

        if (operation === 'fromCompass') {
          output = HeadingConverter.fromCompass(direction);
        } else {
          output = HeadingConverter.toCompass(degrees);
        }

        return res.json({ success: true, output });
      }

      case 'tuple': {
        const { tuple, tupleString, separator } = req.body;
        let output;

        if (operation === 'parse') {
          output = TupleConverter.parse(tupleString);
        } else {
          output = TupleConverter.toString(tuple, separator);
        }

        return res.json({ success: true, output });
      }

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid module. Use one of: truncator, enum, heading, tuple'
        });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

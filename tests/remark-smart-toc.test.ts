import { remark } from 'remark'
import { test } from 'jest'
import remarkTOCPlugin from '../src'

const processMarkdown = async (inputMarkdown) => {
  const result = await remark().use(remarkTOCPlugin(3)).process(inputMarkdown)
  return String(result)
}

describe('Remark TOC Plugin', () => {
  test('should add TOC if [toc] tag is present', async () => {
    const inputMarkdown = `
# Title

[toc]

## Section 1
Some content for section 1.

## Section 2
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('* [Section 2](#section-2)')
  })

  test('should add TOC if [TOC] tag is present', async () => {
    const inputMarkdown = `
# Title

[TOC]

## Section 1
Some content for section 1.

## Section 2
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('* [Section 2](#section-2)')
  })

  test('should add TOC if Chinese "目录" tag is present', async () => {
    const inputMarkdown = `
# Title

目录

## Section 1
Some content for section 1.

## Section 2
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('* [Section 2](#section-2)')
  })

  test('should not add TOC if no TOC tag is present', async () => {
    const inputMarkdown = `
# Title

## Section 1
Some content for section 1.

## Section 2
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).not.toContain('Table of Contents')
  })

  test('should generate correct links with spaces in headings', async () => {
    const inputMarkdown = `
# Title

[toc]

## Section 1
Some content for section 1.

## Section 2 with Spaces
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('* [Section 2 with Spaces](#section-2-with-spaces)')
  })

  test('should generate correct links with special characters in headings', async () => {
    const inputMarkdown = `
# Title

[toc]

## Section 1
Some content for section 1.

## Section 2 & Special Characters
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('* [Section 2 & Special Characters](#section-2--special-characters)')
  })

  test('should handle nested headings correctly', async () => {
    const inputMarkdown = `
# Title

[toc]

## Section 1
Some content for section 1.

### Subsection 1.1
Content for subsection 1.1.

### Subsection 1.2
Content for subsection 1.2.

## Section 2
Some content for section 2.
    `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('  * [Subsection 1.1](#subsection-11)')
    expect(outputMarkdown).toContain('  * [Subsection 1.2](#subsection-12)')
    expect(outputMarkdown).toContain('* [Section 2](#section-2)')
  })

  test('should handle empty input markdown', async () => {
    const inputMarkdown = ''
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toBe('')
  })

  test('should handle headings without content', async () => {
    const inputMarkdown = `
# Title

[toc]

## Section 1

## Section 2
  `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section 1](#section-1)')
    expect(outputMarkdown).toContain('* [Section 2](#section-2)')
  })

  test('should handle headings with the same name but different levels', async () => {
    const inputMarkdown = `
# Title

[toc]

## Section

### Subsection

#### Sub-subsection
  `
    const outputMarkdown = await processMarkdown(inputMarkdown)
    expect(outputMarkdown).toContain('Table of Contents')
    expect(outputMarkdown).toContain('* [Section](#section)')
    expect(outputMarkdown).toContain('  * [Subsection](#subsection)')
    expect(outputMarkdown).toContain('    * [Sub-subsection](#sub-subsection)')
  })
    
})

import { describe, expect, it } from 'vitest'
import { courses } from './courses'

describe('course catalog', () => {
  it('contains unique human-readable slugs', () => {
    const slugs = courses.map((course) => course.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.every((slug) => /^[a-z0-9-]+$/.test(slug))).toBe(true)
  })

  it('does not publish prices or invented schedules', () => {
    expect(JSON.stringify(courses)).not.toMatch(/price|schedule|duration/i)
  })
})

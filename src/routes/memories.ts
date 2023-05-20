import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: 'asc' },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsShema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsShema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const bodyShema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodyShema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '5948bf4f-d2f9-4328-aead-fc12996cc9c4',
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
    const paramsShema = z.object({
      id: z.string().uuid(),
    })

    const bodyShema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { id } = paramsShema.parse(request.params)
    const { content, coverUrl, isPublic } = bodyShema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },

      data: {
        content,
        coverUrl,
        isPublic,
        userId: '5948bf4f-d2f9-4328-aead-fc12996cc9c4',
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsShema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsShema.parse(request.params)

    await prisma.memory.findUniqueOrThrow({
      where: { id },
    })
  })
}

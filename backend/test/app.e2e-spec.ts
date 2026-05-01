import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/infrastructure/persistence/prisma/prisma.service';

describe('Tasks flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.taskFieldChange.deleteMany();
    await prisma.taskStatusChange.deleteMany();
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.taskFieldChange.deleteMany();
    await prisma.taskStatusChange.deleteMany();
    await prisma.task.deleteMany();
    await app.close();
  });

  it('creates, lists, updates and deletes a task', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Tarefa e2e',
        description: 'Criada pelo teste end-to-end',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 86_400_000).toISOString(),
      })
      .expect(201);

    expect(createResponse.body.title).toBe('Tarefa e2e');

    const taskId = createResponse.body.id as string;

    const listResponse = await request(app.getHttpServer()).get('/tasks').expect(200);
    expect(listResponse.body).toHaveLength(1);

    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'REVIEW' })
      .expect(400);

    const updateResponse = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'REVIEW', comment: 'Encaminhando para revisao' })
      .expect(200);

    expect(updateResponse.body.status).toBe('REVIEW');

    const history = await prisma.taskStatusChange.findMany({ where: { taskId } });
    expect(history).toHaveLength(1);
    expect(history[0].comment).toBe('Encaminhando para revisao');

    await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(204);

    const finalList = await request(app.getHttpServer()).get('/tasks').expect(200);
    expect(finalList.body).toHaveLength(0);
  }, 15000);
});

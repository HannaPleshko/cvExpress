import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@/exceptions/HttpException';
import { defaultPool } from '../connection';

export const insertEnvironment = async (): Promise<void> => {
  const pool = defaultPool;
  try {
    await pool.connect();
    await pool.query('BEGIN');
    await pool
      .query(
        `			
                with data(label, category, priority)  as (
                    values
                    ('JavaScript', 'programmingLanguages', 1),
                    ('TypeScript', 'programmingLanguages', 1),
                    ('SQL', 'programmingLanguages', 2),
                    ('Java', 'programmingLanguages', 3),
                    ('GO', 'programmingLanguages', 3),
                    ('python', 'programmingLanguages', 3),
                    ('php', 'programmingLanguages', 3),
                    ('LotusScript', 'programmingLanguages', 3),
                    ('C', 'programmingLanguages', 4),
                    ('C#', 'programmingLanguages', 4),
                    ('C++', 'programmingLanguages', 4),
                    ('Node.js', 'applicationServers', 1),
                    ('Apache HTTP Server', 'applicationServers', 2),
                    ('NGINX', 'applicationServers', 2),
                    ('Lotus Domino', 'applicationServers', 3),
                    ('PostgreSQL', 'databases', 1),
                    ('MySQL', 'databases', 1),
                    ('mongoDB', 'databases', 1),
                    ('Firebase Storage', 'databases', 2),
                    ('IBM Cloudant', 'databases', 2),
                    ('React', 'webTechnologies', 1),
                    ('ANGULARJS', 'webTechnologies', 1),
                    ('Redux', 'webTechnologies', 1),
                    ('Express.js', 'webTechnologies', 1),
                    ('LoopBack 4', 'webTechnologies', 1),
                    ('NEXT.js', 'webTechnologies', 1),
                    ('NestJS', 'webTechnologies', 1),
                    ('Jest', 'webTechnologies', 1),
                    ('MOCHA', 'webTechnologies', 1),
                    ('HTML', 'webTechnologies', 1),
                    ('HTML5', 'webTechnologies', 1),
                    ('CSS', 'webTechnologies', 1),
                    ('CSS3', 'webTechnologies', 1),
                    ('Socket.IO', 'webTechnologies', 1),
                    ('JSON', 'webTechnologies', 1),
                    ('JWT', 'webTechnologies', 1),
                    ('GraphQL', 'webTechnologies', 1),
                    ('Docker', 'webTechnologies', 1),
                    ('Kubernetes', 'webTechnologies', 2),
                    ('Travis CI', 'webTechnologies', 2),
                    ('Jenkins', 'webTechnologies', 2),
                    ('SINON.JS', 'webTechnologies', 2),
                    ('jQuery', 'webTechnologies', 2),
                    ('React Native', 'webTechnologies', 2),
                    ('webpack', 'webTechnologies', 2),
                    ('BABEL', 'webTechnologies', 2),
                    ('Gulp.js', 'webTechnologies', 2),
                    ('Swagger', 'webTechnologies', 2),
                    ('Passport', 'webTechnologies', 2),
                    ('Bash', 'webTechnologies', 2),
                    ('DB2', 'webTechnologies', 2),
                    ('Redis', 'webTechnologies', 2),
                    ('Microsoft SQL Server', 'webTechnologies', 2),
                    ('Marionette.js', 'webTechnologies', 2),
                    ('BACKBONE.JS', 'webTechnologies', 2),
                    ('Handlebars', 'webTechnologies', 2),
                    ('PM2', 'webTechnologies', 3),
                    ('Bootstrap', 'webTechnologies', 3),
                    ('AJAX', 'webTechnologies', 3),
                    ('XML', 'webTechnologies', 3),
                    ('Sass', 'webTechnologies', 3),
                    ('API Doc', 'webTechnologies', 3),
                    ('Nodemon', 'webTechnologies', 3),
                    ('Mongoose', 'webTechnologies', 3),
                    ('Joi', 'webTechnologies', 3),
                    ('npm', 'webTechnologies', 3),
                    ('oAuth 2.0', 'webTechnologies', 3),
                    ('yarn', 'webTechnologies', 4),
                    ('browserify', 'webTechnologies', 4),
                    ('Lodash', 'webTechnologies', 4),
                    ('Cron', 'webTechnologies', 4),
                    ('NodeMailer', 'webTechnologies', 4),
                    ('SendGrid', 'webTechnologies', 4),
                    ('Postman', 'webTechnologies', 4),
                    ('Newman', 'webTechnologies', 4),
                    ('Istanbul', 'webTechnologies', 4),
                    ('Gatsby.js', 'webTechnologies', 4),
                    ('Expo', 'webTechnologies', 4),
                    ('Material UI', 'webTechnologies', 4),
                    ('Git', 'otherSkills', 1),
                    ('Adobe Photoshop', 'otherSkills', 1),
                    ('Webhooks', 'otherSkills', 1),
                    ('LDAP', 'otherSkills', 1),
                    ('Google API', 'otherSkills', 1),
                    ('PayPal API', 'otherSkills', 1),
                    ('Stripe API', 'otherSkills', 1),
                    ('ngrok', 'otherSkills', 1),
                    ('Charles', 'otherSkills', 1),
                    ('cURL', 'otherSkills', 1),
                    ('Scrum', 'otherSkills', 1)
                 ) 
                 insert into Environments (label, category, priority) 
                 SELECT d.label, d.category::environment_category_type, d.priority FROM data d
                 where not exists (SELECT 
                    from Environments env
                    where env.label = d.label);
                `,
      )
      .catch(error => {
        if (error) {
          console.log(error);

          throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_NOT_CREATED);
        }
      });
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    if (error instanceof HttpException) throw error;

    throw new HttpException(500, ExceptionType.DB_INITIALIZE_NOT_CONNECTED);
  }
};

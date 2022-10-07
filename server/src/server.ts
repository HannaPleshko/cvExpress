import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import ResumeRoute from './routes/resume.route';
import EnvironmentRoute from './routes/environment.route';

validateEnv();

const app = new App([new IndexRoute(), new ResumeRoute(), new EnvironmentRoute()]);

app.listen();

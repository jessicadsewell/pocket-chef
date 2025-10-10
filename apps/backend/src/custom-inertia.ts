import { Request, Response } from 'express';
import { inertiaTemplate } from './inertia-template';

export class CustomInertia {
  private req: Request;
  private res: Response;
  private component: string;
  private version: string | number = '1';
  private sharedProps: object = {};

  constructor(req: Request, res: Response, version: string | number = '1') {
    this.version = version;
    this.req = req;
    this.res = res;
  }

  checkVersion(): boolean {
    if (
      this.req.method === 'GET' &&
      this.req.headers['x-inertia'] &&
      this.req.headers['x-inertia-version'] !== this.version
    ) {
      this.res.writeHead(409, { 'X-Inertia-Location': this.req.url }).end();
      return false;
    }
    return true;
  }

  share(props: object): void {
    this.sharedProps = { ...this.sharedProps, ...props };
  }

  async render(component: string = this.component, props?: any): Promise<void> {
    const page = {
      component,
      props: {},
      url: this.req.originalUrl || this.req.url,
      version: this.version,
    };

    const allProps = { ...this.sharedProps, ...props };
    let dataKeys: string[];

    if (
      this.req.headers['x-inertia-partial-data'] &&
      this.req.headers['x-inertia-partial-component'] === component
    ) {
      dataKeys = (<string>this.req.headers['x-inertia-partial-data']).split(
        ',',
      );
    } else {
      dataKeys = Object.keys(allProps);
    }

    for (const key of dataKeys) {
      if (typeof allProps[key] === 'function') {
        page.props[key] = await allProps[key]();
      } else {
        page.props[key] = allProps[key];
      }
    }

    if (this.req.headers['x-inertia']) {
      this.res
        .writeHead(200, {
          Vary: 'Accept',
          'X-Inertia': 'true',
          'Content-Type': 'application/json',
        })
        .end(JSON.stringify(page));
    } else {
      // Properly escape the JSON for HTML attribute
      const pageJson = JSON.stringify(page);
      const encodedPageString = pageJson
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      this.res
        .writeHead(200, {
          'Content-Type': 'text/html',
        })
        .end(inertiaTemplate(encodedPageString));
    }
  }

  redirect(url: string): void {
    const statusCode = ['PUT', 'PATCH', 'DELETE'].includes(this.req.method)
      ? 303
      : 302;

    this.res.writeHead(statusCode, { Location: url }).end();
  }
}

export function customInertiaMiddleware(
  req: Request,
  res: Response,
  next: Function,
) {
  res.inertia = new CustomInertia(req, res);
  if (!res.inertia.checkVersion()) {
    return;
  }
  next();
}

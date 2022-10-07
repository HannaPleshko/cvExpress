import EnvironmentService from '@/services/environment.service';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from './../exceptions/HttpException';
import { Languages } from '../dto/resume.dto';
import { ResumeDto, ResumeExperience } from '@/dto/resume.dto';
import { IConvertService } from '@/interfaces/convert.interface';
import {
  Document,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TextRun,
  TableRow,
  BorderStyle,
  WidthType,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  HeightRule,
  TabStopType,
  convertMillimetersToTwip,
} from 'docx';
import fs from 'fs/promises';
import { IEnvironment } from '@/interfaces/environment.interface';

const SettingOfPage = {
  SizeWidth: 210,
  SizeHeight: 297,
  MarginTop: 38.2,
  MarginRight: 12.7,
  MarginBottom: 12.7,
  MarginLeft: 12.7,
} as const;

const SizeOfString = {
  DefaultSize: 20,
  BiggerSize: 32,
} as const;

const MSDocDot = '●';

const Styles = {
  IndentBeforeLine2Mill: 'IndentBeforeLine2Mill',
  IIndentAfterLine2Mill: 'IIndentAfterLine2Mill',
  SectionTitle: 'sectionTitle',
} as const;

export class ConversionService implements IConvertService {
  readonly resume: ResumeDto;
  private environmentService: EnvironmentService;

  constructor(resume: ResumeDto) {
    this.resume = resume;
    this.environmentService = new EnvironmentService();
  }

  async convertToDocx(): Promise<Buffer> {
    try {
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: Styles.SectionTitle,
              name: 'Section Title',
              basedOn: 'Default Text',
              next: Styles.SectionTitle,
              paragraph: {
                spacing: {
                  before: 240,
                  after: 120,
                },
              },
              run: {
                size: SizeOfString.DefaultSize,
                bold: true,
                font: 'Arial',
                shading: {
                  fill: 'C8C8C8',
                },
              },
            },
            {
              id: Styles.IndentBeforeLine2Mill,
              name: Styles.IndentBeforeLine2Mill,
              basedOn: 'Default Text',
              next: Styles.IndentBeforeLine2Mill,
              paragraph: {
                spacing: {
                  before: convertMillimetersToTwip(2),
                },
              },
              run: {
                size: SizeOfString.DefaultSize,
              },
            },
            {
              id: Styles.IIndentAfterLine2Mill,
              name: Styles.IIndentAfterLine2Mill,
              basedOn: 'Default Text',
              next: Styles.IIndentAfterLine2Mill,
              paragraph: {
                spacing: {
                  after: convertMillimetersToTwip(2),
                },
              },
              run: {
                size: SizeOfString.DefaultSize,
              },
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: convertMillimetersToTwip(SettingOfPage.SizeWidth),
                  height: convertMillimetersToTwip(SettingOfPage.SizeHeight),
                },
                margin: {
                  top: convertMillimetersToTwip(SettingOfPage.MarginTop),
                  right: convertMillimetersToTwip(SettingOfPage.MarginRight),
                  bottom: convertMillimetersToTwip(SettingOfPage.MarginBottom),
                  left: convertMillimetersToTwip(SettingOfPage.MarginLeft),
                },
              },
            },
            headers: {
              default: new Header({
                children: [await this.createHeader()],
              }),
            },
            children: [
              this.createSection('PROFESSIONAL PROFILE'),

              ...this.CreateBulletedList(this.resume.header.profile),

              this.createSection('SKILLS SUMMARY'),

              this.CreateSkillSummary(),

              this.createSection('PROFESSIONAL EXPERIENCE'),

              ...this.createProfessionalExperience(this.resume.experience),

              this.createSection('EDUCATION and TRAINING'),

              ...this.CreateBulletedList(this.resume.education),
            ],
          },
        ],
      });
      return await Packer.toBuffer(doc);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.CONVERSION_CONVERT_NOT_CONVERTED);
    }
  }

  createDate(start: string, end: string): string {
    const endDate = !end ? 'Present' : this.convertDateToString(end);
    const startDate = this.convertDateToString(start);

    return `${startDate} - ${endDate}`;
  }

  createProfessionalExperience(experiences: ResumeExperience[]): any[] {
    return experiences.reduce((acc, experience) => {
      acc.push(
        ...[
          new Paragraph({
            tabStops: [
              {
                position: 1200,
                type: TabStopType.LEFT,
              },
            ],
            style: Styles.IndentBeforeLine2Mill,
            children: [
              new TextRun({
                font: 'Arial',
                bold: true,
                size: SizeOfString.DefaultSize,
                text: `${experience.positionLevel} ${experience.userPosition} \t${experience.companyName}`,
              }),
            ],
          }),
          new Paragraph({
            style: Styles.IIndentAfterLine2Mill,
            children: [
              new TextRun({
                font: 'Arial',
                size: SizeOfString.DefaultSize,
                text: this.createDate(experience.startDate.toString(), experience.endDate?.toString()),
              }),
            ],
          }),

          ...experience.projects.map(project => {
            return new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              borders: {
                right: {
                  style: BorderStyle.NONE,
                },
                left: {
                  style: BorderStyle.NONE,
                },
                bottom: {
                  style: BorderStyle.NONE,
                },
                top: {
                  style: BorderStyle.NONE,
                },
                insideHorizontal: {
                  style: BorderStyle.NONE,
                },
                insideVertical: {
                  style: BorderStyle.NONE,
                },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2,
                      children: [
                        new Paragraph({
                          indent: {
                            left: convertMillimetersToTwip(4),
                          },
                          style: Styles.IndentBeforeLine2Mill,
                          children: [
                            new TextRun({
                              font: 'Arial',
                              bold: true,
                              size: SizeOfString.DefaultSize,
                              text: `${experience.positionLevel} ${experience.userPosition}`,
                            }),
                          ],
                        }),
                        new Paragraph({
                          indent: {
                            left: convertMillimetersToTwip(4),
                          },
                          children: [
                            new TextRun({
                              font: 'Arial',
                              size: SizeOfString.DefaultSize,
                              text: `${project.description}`,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          indent: {
                            left: convertMillimetersToTwip(4),
                          },
                          children: [
                            new TextRun({
                              font: 'Arial',
                              size: SizeOfString.DefaultSize,
                              text: `Responsibilities: `,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [...this.createResponsibilities(project.responsibilities)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          indent: {
                            left: convertMillimetersToTwip(4),
                          },
                          style: Styles.IndentBeforeLine2Mill,
                          children: [
                            new TextRun({
                              font: 'Arial',
                              size: SizeOfString.DefaultSize,
                              text: `Environment: `,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          indent: {
                            left: convertMillimetersToTwip(33),
                          },
                          style: Styles.IndentBeforeLine2Mill,
                          children: [
                            new TextRun({
                              font: 'Arial',
                              size: SizeOfString.DefaultSize,
                              text: this.sortedEnvironment(project.environment.map(env => env.environment_id)),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            });
          }),
        ],
      );
      return acc;
    }, []);
  }

  deleteDuplicateWords(arr: string[]): string[] {
    return [...new Set(arr)];
  }

  sortedEnvironment(ids: string[]): string {
    const skills = this.environmentService.getSkillsByIds(ids);
    const filteredListByPriority = skills.sort(this.compare);
    const env = this.deleteDuplicateWords(filteredListByPriority.map(item => item.label));
    const stringOfEnv = env.join(', ');

    return stringOfEnv;
  }
  createResponsibilities(responsibilities: string[]): Paragraph[] {
    return responsibilities.map(responsibiliti => {
      return new Paragraph({
        indent: {
          left: convertMillimetersToTwip(33),
        },
        children: [
          new TextRun({
            font: 'Arial',
            size: SizeOfString.DefaultSize,
            text: `-${responsibiliti}`,
          }),
        ],
      });
    });
  }

  createTableCellsForSkillSummary(text: string, data: string | Paragraph[]): TableCell[] {
    let tableCellWithData;
    if (typeof data === 'string') {
      tableCellWithData = new TableCell({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                size: SizeOfString.DefaultSize,
                text: data,
              }),
            ],
          }),
        ],
      });
    } else if (data) {
      tableCellWithData = new TableCell({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        children: [...data],
      });
    } else {
      tableCellWithData = new TableCell({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                size: SizeOfString.DefaultSize,
                text: '',
              }),
            ],
          }),
        ],
      });
    }

    return [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                size: SizeOfString.DefaultSize,
                text: text,
              }),
            ],
          }),
        ],
      }),
      tableCellWithData,
    ];
  }

  CreateSkillSummary(): Table {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        right: {
          style: BorderStyle.NONE,
        },
        left: {
          style: BorderStyle.NONE,
        },
        bottom: {
          style: BorderStyle.NONE,
        },
        top: {
          style: BorderStyle.NONE,
        },
        insideHorizontal: {
          style: BorderStyle.NONE,
        },
        insideVertical: {
          style: BorderStyle.NONE,
        },
      },
      rows: [
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Programming Languages:', this.getLabelsByCategory('programmingLanguages'))],
        }),
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Web Technologies:', this.getLabelsByCategory('webTechnologies'))],
        }),
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Application Servers:', this.getLabelsByCategory('applicationServers'))],
        }),
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Databases:', this.getLabelsByCategory('databases'))],
        }),
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Operating Systems:', this.resume.skills.operatingSystems.join(', '))],
        }),
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Other Skills:', this.getLabelsByCategory('otherSkills'))],
        }),
        new TableRow({
          children: [...this.createTableCellsForSkillSummary('Foreign Languages:', this.getLabelsOfLanguage(this.resume.skills.languages))],
        }),
        //need to add the correct indentation for the columns
        new TableRow({
          height: {
            value: 1,
            rule: HeightRule.ATLEAST,
          },
          children: [
            new TableCell({
              margins: {
                right: convertMillimetersToTwip(50),
              },
              children: [],
            }),
            new TableCell({
              children: [],
            }),
          ],
        }),
      ],
    });
  }

  getLabelsOfLanguage(language: Languages[]): Paragraph[] {
    const str = [];
    if (!language) {
      return [
        new Paragraph({
          children: [
            new TextRun({
              font: 'Arial',
              size: SizeOfString.DefaultSize,
              text: '',
            }),
          ],
        }),
      ];
    }
    language.forEach(label => {
      str.push(`${label.language}\t ${label.level}`);
    });

    return str.map(item => {
      return new Paragraph({
        tabStops: [
          {
            position: 1200,
            type: TabStopType.LEFT,
          },
        ],
        children: [
          new TextRun({
            font: 'Arial',
            size: SizeOfString.DefaultSize,
            text: item,
          }),
        ],
      });
    });
  }

  getLabelsByCategory(category: string): string {
    const labels = this.resume.experience
      .map(experience => {
        return experience.projects
          .map(project => {
            const skills = this.environmentService.getSkillsByIds(project.environment.map(env => env.environment_id));
            const filteredList = skills.filter(env => env.category === category);
            const filteredListByPriority = filteredList.sort(this.compare);
            const newListOfLabels = filteredListByPriority.map(category => category.label);

            return newListOfLabels.join(', ');
          })
          .join(', ');
      })
      .join(', ');

    const formattedLabels = this.deleteDuplicateWords(labels.split(', '));
    const stringOfLabels = formattedLabels.reduce(
      (acc, label, index) => (label === '' ? acc : index === formattedLabels.length - 1 ? (acc += label) : (acc += label + ', ')),
      '',
    );

    return stringOfLabels;
  }

  compare(a: IEnvironment, b: IEnvironment): number {
    if (a.priority < b.priority) {
      return -1;
    }
    if (a.priority > b.priority) {
      return 1;
    }

    return 0;
  }

  async createHeader(): Promise<Table> {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        right: {
          style: BorderStyle.NONE,
        },
        left: {
          style: BorderStyle.NONE,
        },
        bottom: {
          style: BorderStyle.NONE,
        },
        top: {
          style: BorderStyle.NONE,
        },
        insideHorizontal: {
          style: BorderStyle.NONE,
        },
        insideVertical: {
          style: BorderStyle.NONE,
        },
      },
      rows: [
        new TableRow({
          height: {
            value: 85.36,
            rule: HeightRule.AUTO,
          },
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'Arial',
                      size: SizeOfString.BiggerSize,
                      bold: true,
                      text: `${this.resume.header.firstName} ${this.resume.header.lastName}`,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'Arial',
                      size: SizeOfString.DefaultSize,
                      bold: true,
                      text: `${this.resume.header.positionLevel} ${this.resume.header.userPosition}`,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: await this.getImage(),
                      transformation: {
                        width: 130,
                        height: 74,
                      },
                      floating: {
                        allowOverlap: true,
                        layoutInCell: true,
                        behindDocument: false,
                        horizontalPosition: {
                          align: HorizontalPositionAlign.RIGHT,
                        },
                        verticalPosition: {
                          align: VerticalPositionAlign.CENTER,
                        },
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  async getImage(): Promise<Buffer> {
    try {
      return await fs.readFile('./src/images/logo.jpg');
    } catch (e) {
      throw new HttpException(500, ExceptionType.CONVERSION_GET_IMAGE_NOT_GOT);
    }
  }

  CreateBulletedList = (list: string[] | undefined): Paragraph[] => {
    if (list?.length === 0 || !list) {
      return [
        new Paragraph({
          children: [
            new TextRun({
              font: 'Arial',
              size: SizeOfString.DefaultSize,
              text: '-',
            }),
          ],
        }),
      ];
    }

    return list.map(item => {
      return new Paragraph({
        indent: {
          left: convertMillimetersToTwip(1.3),
        },
        children: [
          new TextRun({
            font: 'Arial',
            size: SizeOfString.DefaultSize,
            text: `${MSDocDot} ${item}`,
          }),
        ],
      });
    });
  };

  createSection = (name: string): Paragraph => {
    return new Paragraph({
      style: Styles.SectionTitle,
      children: [
        new TextRun({
          text: name,
        }),
      ],
    });
  };

  convertDateToString(date: string): string {
    try {
      const ourDate = new Date(date);
      if (isNaN(ourDate.getTime())) throw new HttpException(400, ExceptionType.CONVERSION_CONVERT_DATE_INCORRECT);

      const month = ourDate.toLocaleString('en-US', { month: 'long' });

      return `${month} ${ourDate.getFullYear()}`;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.CONVERSION_CONVERT_DATE_NOT_CONVERTED);
    }
  }
}

export default ConversionService;

export class Lesson {
  public id?: string;

  constructor(
    public studentId: string,
    public date: string,
    public time: string,
    public durationHours: string,
    public durationMinutes: string,
    public note: string
  ) {}

  setId(id: string): void {
    this.id = id;
  }

  calculateEndTime(): string {
    const [hours, minutes] = this.time.split(':').map(Number);

    const durationHrs = parseInt(this.durationHours);
    const durationMins = parseInt(this.durationMinutes);

    let endHours = hours + durationHrs;
    let endMinutes = minutes + durationMins;

    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }

    endHours = endHours % 24;

    const formattedHours = endHours.toString().padStart(2, '0');
    const formattedMinutes = endMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  getFormattedLessonDate(): string {
    const [year, month, day] = this.date.split('-');

    return `${day}.${month}.${year}`;
  }

  isDateToday(): boolean {
    const now = new Date();
    const lessonDate = new Date(this.date);

    return (
      lessonDate.getDate() === now.getDate() &&
      lessonDate.getMonth() === now.getMonth() &&
      lessonDate.getFullYear() === now.getFullYear()
    );
  }

  isInProgress(): boolean {
    const now = new Date();
    const lessonStart = new Date(this.date + 'T' + this.time);
    const lessonEnd = new Date(this.date + 'T' + this.calculateEndTime());

    if (lessonEnd < lessonStart) {
      lessonEnd.setDate(lessonEnd.getDate() + 1);
    }
    return lessonStart <= now && now <= lessonEnd;
  }

  timeUntilNextLessonStart(): string {
    const now = new Date();
    const lessonDateTime = new Date(this.date + 'T' + this.time);
    let timeDifference = lessonDateTime.getTime() - now.getTime();

    if (timeDifference < 0) {
      return '00:00:00';
    }

    let hours = Math.floor(timeDifference / (1000 * 60 * 60))
      .toString()
      .padStart(2, '0');
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0');
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0');

    return hours + ':' + minutes + ':' + seconds;
  }
}

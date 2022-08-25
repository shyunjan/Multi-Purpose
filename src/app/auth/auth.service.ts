import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MemberDto, LoginMemberDto, UpdateMemberDto } from './dto';
import { SessionType } from 'src/types';

@Injectable()
/**
 * Singleton이 아닌 Multi-Thread 방식(request scope)으로 사용할려면 아래와 같이 scope를 셋팅한다.
 // @Injectable({ scope: Scope.REQUEST })
 * 이 경우에 이 service를 사용하는 controller도 lifetime이 request scope가 된다.
 * 반면에 이 service에 inject되는 어떤 provider(예 *repository)는 singleton이다.
 * 그러나 Scope.TRANSIENT 방식은 어떤 방향으로든 서로 아무런 영향을 주지 않는다. 자세한 내용은 아래 매뉴얼 페이지 참조
 * https://docs.nestjs.com/fundamentals/injection-scopes */
export class AuthService {
  private cnt: number = 0;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async loginCache(loginData: LoginMemberDto): Promise<SessionType | null> {
    const lastLoginTime: number | undefined = await this.cacheManager.get<number>(loginData.loginId);
    console.log('lastLoginTime =', lastLoginTime);
    return this.saveCache(loginData as MemberDto);
  }

  login(loginData: LoginMemberDto): string {
    ++this.cnt;
    console.log('loginData.password =', loginData.password);
    return `This user's login ID is #${loginData.loginId}: \n` + `Login OK! your request count = ${this.cnt}`;
  }

  async saveCache(member: MemberDto): Promise<SessionType | null> {
    const loginTime: number = new Date().getTime();
    await this.cacheManager.set<number>(member.loginId, loginTime, { ttl: 600 });
    return { loginId: member.loginId, loginTime };
  }

  async saveArrayCache(members: MemberDto[]): Promise<SessionType[]> {
    const results: SessionType[] = [];

    for (const m of members) {
      const s = await this.saveCache(m);
      if (s) results.push(s);
    }

    return results;
  }

  create(member: MemberDto): string {
    return `memberDto = ${JSON.stringify(member)}\nCreating the Member is SUCCESS!`;
  }

  getUser(id: number): string {
    return `This user ID is #${id}.`;
  }

  update(id: number, memberDto: UpdateMemberDto): string {
    return (
      `This user ID is #${id}: \n` + `memberDto = ${JSON.stringify(memberDto)}\n` + `Updating the Member is SUCCESS!`
    );
  }
}
